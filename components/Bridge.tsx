import { Fuel, Link, Repeat } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { createWalletClient, custom, encodeFunctionData, formatUnits, Hex, parseEther } from "viem";
import { espresso } from "@/lib/espresso-chain";
import { arbitrumSepolia } from "viem/chains";
import { createPublicClient, http } from 'viem';
import { handleGetArbitrumSepoliaBalance, handleGetEspressoBalance } from "@/app/utils/privy";
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const proxyRpcUrl = "/api/rpc-proxy";

const Bridge = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [address, setaddress] = useState<string | null>(null);
  const [amt, setAmt] = useState<number | null>(0);
  // const { ready, authenticated, login, logout } = usePrivy();
  const [walletClient, setWalletClient] = useState<ReturnType<
    typeof createWalletClient
  > | null>(null);
  const [arbBalance, setArbBalance] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [espressoBalance, setEspressoBalance] = useState<number | bigint>(0);
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const getAddress = async () => {
      if (!wallet) return;
      try {
        error && setError(null); // dummy usage to clear build error
        console.log("Connected wallet:", wallet.address);
        setaddress(wallet.address);
      } catch (error) {
        console.error("Error getting balance in bridge.tsx:", error);
      }
    };
    getAddress();
  }, [wallet]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmt(value === "" ? null : Number(value));
  };

  useEffect(() => {
    const initializeWalletClient = async () => {
      if (!wallet) return;
      try {
        const provider = await wallet.getEthereumProvider();
        const client = createWalletClient({
          account: wallet.address as Hex,
          chain: espresso,
          transport: custom(provider),
        });

        setWalletClient(client as any);
        console.log("Connected wallet:", wallet.address);
      } catch (error) {
        console.error("Error initializing wallet client:", error);
        setError("Failed to initialize wallet client");
      }
    };

    initializeWalletClient();
    getArbitrumSepoliaBalance(); // Ensure these functions are included in dependencies
    getEspressoBalance();
  }, [wallet]); // Include dependencies

  const handleBridgeFundToInbox = async () => {
    if (!walletClient) {
      setError("Wallet client not initialized");
      return;
    }

    setLoading(true);
    try {
      const [address] = await walletClient.getAddresses();

      if (Number(wallet.chainId) !== arbitrumSepolia.id) {
        await wallet.switchChain(arbitrumSepolia.id);
      }

      const inboxDepositAbi = [
        {
          inputs: [],
          name: "depositEth",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "payable",
          type: "function",
        },
      ];

      const functionData = encodeFunctionData({
        abi: inboxDepositAbi,
        functionName: "depositEth",
        args: [],
      });

      const transaction = {
        account: address,
        to: "0xFF0cEc49832Fe76957BBB55F1c331f4Fd689369a" as `0x${string}`,
        value: BigInt(amt ?? 0),
        data: functionData,
        chain: arbitrumSepolia,
      };

      const hash = await walletClient.sendTransaction(transaction);
      console.log("Transaction hash:", hash);
      setHash(hash);

      const response = await fetch('/api/db/bridge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hash: hash, status: "pending", amountInWei: amt, wallet: wallet.address }),
      });
      
      const result = await response.json();
      console.log("User created successfully:", result);
      if (result.error) {
        throw new Error(result.error);
      }
      console.log("User created successfully:", result.receivedData);
      setError("error in bridging");
    } catch (error) {
      console.error("Transaction error:", error);
      setError(
        "Transaction failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  }

  const handleGetBridgeData = async () => {
    try {
      const response = await fetch('/api/db/bridge/getBridgeDataByUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet: wallet.address }),
      })
      const result = await response.json();
      console.log("Bridge data:", result);
      if (result.error) {
        throw new Error(result.error);
      }
      console.log("Bridge data:", result.receivedData);
    } catch (error) {
      console.log("error getting bridge data", error);
    }
  }
  

  const getArbitrumSepoliaBalance = async () => {
    const getBalance = await handleGetArbitrumSepoliaBalance(wallet);
    console.log("getbalance", getBalance);
    setArbBalance(getBalance);
  };

  const getEspressoBalance = async () => {
    const getbalance = await handleGetEspressoBalance(wallet); 
    setEspressoBalance(getbalance);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-coffee text-cream px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer dark:bg-cream dark:text-coffee hover:bg-coffee/70 dark:hover:bg-cream/70 flex items-center">
          <Repeat className="mr-2" size={16} />
          Bridge
        </button>
      </DialogTrigger>
      <DialogContent className="bg-coffee dark:bg-cream text-cream dark:text-coffee p-6 rounded-lg border-none">
        <ScrollArea className="h-[490px] w-full pr-3">
          <DialogTitle className="text-lg font-bold">Bridge</DialogTitle>
          <DialogDescription className="sr-only">
            Use this dialog to bridge your assets across chains.
          </DialogDescription>

          <div className="mt-4 flex flex-col gap-2 relative z-1">
            <div className="flex items-center justify-between bg-cream dark:bg-coffee text-coffee dark:text-cream px-4 py-2 rounded">
              <div className="flex flex-col gap-1">
                <span className="text-sm">Origin</span>
                <span className="font-bold">Arbitrum Sepolia</span>
                <span>Balance: {arbBalance}</span>
              </div>
              <Image
                src="/arbitrum.svg"
                alt="Arbitrum"
                width={24}
                height={24}
                className="dark:hidden"
              />
            </div>
            {/* <button
              disabled
              className="absolute top-[35%] left-1/2 right-1/2 z-10 bg-coffee text-cream px-4 py-2 rounded-lg font-medium transition-all dark:bg-cream dark:text-coffee border border-cream dark:border-coffee flex justify-center"
            >
              <ArrowDownUp size={16} className="flex-shrink-0" />
              <span className="sr-only">Swap</span>
            </button> */}
            <div className="flex items-center justify-between bg-cream dark:bg-coffee text-coffee dark:text-cream px-4 py-2 rounded">
              <div className="flex flex-col gap-1">
                <span className="text-sm">Destination</span>
                <span className="font-bold">Espresso Arbitrum Sepolia</span>
                <span>Balance: {espressoBalance}</span>
              </div>
              <Image
                src="/ethereum-dark.svg"
                alt="Ethereum"
                width={24}
                height={24}
                className="dark:hidden"
              />
              <Image
                src="/ethereum.svg"
                alt="Ethereum"
                width={24}
                height={24}
                className="hidden dark:block"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="relative flex flex-col">
              <label htmlFor="amount" className="font-semibold">
                Amount to Bridge (in wei)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min={0}
                className="w-full bg-cream dark:bg-coffee text-coffee dark:text-cream px-4 pt-2 pb-1 rounded-t mt-2 text-2xl focus:outline-none focus:ring-2 focus:ring-coffee dark:focus:ring-cream placeholder:text-coffee dark:placeholder:text-cream font-medium"
                placeholder="0"
                value={amt ?? ""}
                onChange={handleAmountChange} // Handle input changes
              />
              {/* <span className="text-sm bg-cream dark:bg-coffee text-coffee dark:text-cream w-full rounded-b pl-3.5 pb-1">
                $0
              </span> */}
            </div>
            <div>
              <label htmlFor="address" className="font-semibold">
                To
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="w-full bg-cream dark:bg-coffee text-coffee dark:text-cream px-4 pt-2 pb-1 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-coffee dark:focus:ring-cream placeholder:text-coffee dark:placeholder:text-cream placeholder:opacity-50 font-medium"
                placeholder={address || "Enter address"}
                value={address || ""}
                disabled={!!address}
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Transaction Overview</p>
            <div className="bg-cream dark:bg-coffee text-coffee dark:text-cream rounded px-3 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Amount</span>
                <span className="">{amt}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Fuel size={16} />
                  <span className="text-sm">Fee</span>
                </div>
                <span className="">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Amount After Fee</span>
                <span className="">{amt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm ">Estimated Time</span>
                <span className="">in 16 minutes</span>
              </div>
            </div>
          </div>
          <button
            className="bg-cream  text-coffee px-4 py-2 rounded font-medium hover:opacity-65 transition-all cursor-pointer dark:bg-coffee dark:text-cream flex items-center justify-center mt-4 w-full"
            onClick={handleGetBridgeData}
          >
            <Repeat className="mr-2" size={16} />
            Bridge
          </button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Bridge;

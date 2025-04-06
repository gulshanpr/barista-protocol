import { Fuel, Repeat } from "lucide-react";
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

      // Define the transaction parameters
      const transaction = {
        account: address,
        to: "0xFF0cEc49832Fe76957BBB55F1c331f4Fd689369a" as `0x${string}`, // Replace with your contract address
        value: BigInt(amt ?? 0), // Use the amount from the state, ensure it's in wei
        data: functionData, // No additional data needed for depositEth if it's payable
        chain: arbitrumSepolia, // Ensure the correct chain ID is used
      };

      // Send the transaction
      const hash = await walletClient.sendTransaction(transaction);
      console.log("Transaction hash:", hash);
      setError(null);
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
  

  const getArbitrumSepoliaBalance = async () => {
    if (!wallet || !wallet.address) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if the wallet is connected to the correct chain
      if (Number(wallet.chainId) !== arbitrumSepolia.id) {
        // Switch to Arbitrum Sepolia if not already connected
        await wallet.switchChain(arbitrumSepolia.id);
      }

      console.log("Chain ID is", wallet.chainId);

      // Use the RPC endpoint for Arbitrum Sepolia
      const rpcUrl = arbitrumSepolia.rpcUrls.default.http[0];
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [wallet.address, "latest"],
        }),
      });

      // Log the raw response text for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Parse the JSON response
      const data = JSON.parse(responseText);

      if (data.error) {
        throw new Error(data.error.message || "RPC error");
      }

      if (data.result) {
        const balanceWei = BigInt(data.result); // Keep full precision in Wei
        console.log("Balance in Wei:", balanceWei.toString()); // Full balance without loss

        setArbBalance(BigInt(balanceWei)); // Convert to Ether for display
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch balance: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const getEspressoBalance = async () => {
    if (!wallet || !wallet.address) {
      setError("No wallet connected");
      return;
    }

    if (Number(wallet.chainId) !== espresso.id) {
      // Switch to Arbitrum Sepolia if not already connected
      await wallet.switchChain(arbitrumSepolia.id);
    }

    setLoading(true);
    setError(null);

    try {
      console.log("chainId is first", wallet.chainId);

      //   // Use the proxy RPC endpoint
      //   if(wallet.chainId === 345678){
      //     await wallet.switchChain(arbitrumSepolia.id);
      //   }
      const response = await fetch(proxyRpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [wallet.address, "latest"],
        }),
      });

      console.log("chainId is", wallet.chainId);

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "RPC error");
      }

      if (data.result) {
        const balanceWei = BigInt(data.result); // Keep full precision in Wei
        console.log("Balance in Wei:", balanceWei.toString()); // Full balance without loss
        setEspressoBalance(balanceWei); // Set the full precision balance
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch balance: " + (error as any).message);
    } finally {
      setLoading(false);
    }
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
            onClick={handleBridgeFundToInbox}
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

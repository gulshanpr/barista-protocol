"use client";
import { espresso } from "@/lib/espresso-chain";
import { useWallets } from "@privy-io/react-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPublicClient, formatUnits, http } from "viem";
import { arbitrumSepolia } from "viem/chains";

const options = ["usdc", "eth"];

const Page = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [selectedToken, setSelectedToken] = useState("usdc");
  const [loading, setLoading] = useState(false);
  const [swichChain, setSwichChain] = useState(true); // true = Ethereum, false = Arbitrum

  const toggleChain = async () => {
    setSwichChain((prev) => !prev);
    try {
      const newChainId = swichChain ? arbitrumSepolia.id : espresso.id;
      await wallet.switchChain(newChainId);
      console.log("Switched to chain ID:", newChainId);
    } catch (error) {
      console.error("Error switching chain:", error);
      setError("Failed to switch chain: " + (error as any).message);
    }
  };


  useEffect(() => {
    const getBalance = async () => {
      getUSDCBalance();
    };

    getBalance();
  }, []);

  const handleSelectLendingToken = async (event) => {
    const selectedValue = event.target.value;
    console.log("Selected lending token:", selectedValue);
    setSelectedToken(selectedValue);
    await getTokenBalance(selectedValue);
  };

  const getTokenBalance = async (selectedToken) => {
    if (selectedToken === "usdc") {
      await getUSDCBalance();
    } else if (selectedToken === "eth") {
      await getArbitrumSepoliaBalance();
    }
  };

  const getArbitrumSepoliaBalance = async () => {
    if (!wallet || !wallet.address) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (Number(wallet.chainId) !== arbitrumSepolia.id) {
        await wallet.switchChain(arbitrumSepolia.id);
      }

      console.log("Chain ID is", wallet.chainId);

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

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      const data = JSON.parse(responseText);

      if (data.error) {
        throw new Error(data.error.message || "RPC error");
      }

      if (data.result) {
        const balanceWei = BigInt(data.result);
        console.log("ETH Balance in Wei:", balanceWei.toString());

        setBalance(formatUnits(balanceWei, 18));
      }
    } catch (error) {
      console.error("Error fetching ETH balance:", error);
      setError("Failed to fetch ETH balance: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const getUSDCBalance = async () => {
    if (!wallet || !wallet.address) {
      setError("No wallet connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (Number(wallet.chainId) !== arbitrumSepolia.id) {
        await wallet.switchChain(arbitrumSepolia.id);
      }

      console.log("Chain ID is", wallet.chainId);

      const client = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(arbitrumSepolia.rpcUrls.default.http[0]),
      });

      const usdcContractAddress = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";

      const erc20Abi = [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
      ];

      const data = await client.readContract({
        address: usdcContractAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [wallet.address],
      });

      console.log("USDC Balance in Wei:", data.toString());
      console.log("USDC Balance in decimal:", formatUnits(data, 6));

      setBalance(formatUnits(data, 6));
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      setError("Failed to fetch USDC balance: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-10 py-10 px-4 md:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-[75%_20%] gap-20">
        <div className="flex flex-col gap-10">
          <h1 className="flex items-center gap-15 text-7xl font-bold relative">
            <div className="p-2 bg-coffee dark:bg-cream rounded-full">
              <Image
                src="/ethereum.svg"
                alt="Ethereum Logo"
                width={50}
                height={50}
                className="dark:hidden"
              />
              <Image
                src="/ethereum-dark.svg"
                alt="Ethereum Logo"
                width={50}
                height={50}
                className="hidden dark:block"
              />
            </div>
            <div className="absolute left-10 p-2 bg-coffee dark:bg-cream rounded-full">
              <Image
                src="/usdc-dark.svg"
                alt="USDC Logo"
                width={50}
                height={50}
                className="dark:hidden"
              />
              <Image
                src="/usdc.svg"
                alt="USDC Logo"
                width={50}
                height={50}
                className="hidden dark:block"
              />
            </div>
            ETH / USDC
          </h1>
          <div className="flex md:flex-row gap-10 justify-between items-center flex-wrap">
            <div className="details">
              <h2>Total Supply</h2>
              <span>41.65M</span>
            </div>
            <div className="details">
              <h2>Liquidity</h2>
              <span>5.90M</span>
            </div>
            <div className="details">
              <h2>Rate</h2>
              <span>2.47%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            
            <div className="bg-coffee dark:bg-cream rounded-lg p-5 flex flex-col gap-5 dark:text-coffee text-cream text-xl relative">
              {/* Toggle aligned at bottom-right */}
              <div className="absolute bottom-5 right-5">
                <button
                  onClick={toggleChain}
                  className={`flex items-center px-2 py-1 rounded-full border-2 transition-colors duration-300 ${
                    swichChain
                      ? "bg-coffee dark:bg-cream border-cream dark:border-coffee"
                      : "bg-cream dark:bg-coffee border-coffee dark:border-cream"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-all duration-300 ${
                      swichChain
                        ? "bg-cream dark:bg-coffee ml-0"
                        : "bg-coffee dark:bg-cream ml-6"
                    }`}
                  />
                  <span className="ml-2 text-sm font-medium text-cream dark:text-coffee">
                    {swichChain ? "Espresso Testnet" : "Arbitrum Sepolia"}
                  </span>
                </button>
              </div>
              <h3 className="pl-1">Supply Lending Token</h3>
               
              <select
                defaultValue={"usdc"}
                onChange={handleSelectLendingToken}
                className="bg-coffee dark:bg-cream rounded-lg p-5 text-cream placeholder:text-2xl border border-cream dark:border-coffee dark:placeholder:text-coffee"
              >
                {options.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency.toUpperCase()}
                  </option>
                ))}
              </select>

              <span className="pl-1">Balance: {balance}</span>

             
            </div>

            <div className="bg-coffee dark:bg-cream rounded-lg p-5 flex flex-col gap-5 dark:text-coffee text-cream text-xl">
              <h3 className="pl-1">Lend</h3>
              <input
                type="number"
                placeholder="0.00"
                min={0}
                className="bg-coffee dark:bg-cream rounded-lg p-5 flex flex-col gap-5 text-cream placeholder:text-2xl
                  border border-cream dark:border-coffee dark:placeholder:text-coffee"
              />
              <span className="pl-1">$0</span>
            </div>
            <button
              className="col-span-2
            bg-coffee dark:bg-cream rounded-lg p-4 flex flex-col gap-5 text-cream dark:text-coffee text-xl hover:opacity-85 cursor-pointer transition-all"
            >
              Lend
            </button>
          </div>
        </div>
        <div>
          <div className="additional-details">
            <h3>Lending Token</h3>
            <span>
              <Image
                src="/ethereum.svg"
                alt="Ethereum Logo"
                width={25}
                height={25}
                className="dark:hidden"
              />
              <Image
                src="/ethereum-dark.svg"
                alt="Ethereum Logo"
                width={25}
                height={25}
                className="hidden dark:block"
              />
              {selectedToken.toUpperCase()}
            </span>
          </div>
          <div className="additional-details">
            <h3>Loan Token</h3>
            <span>
              <Image
                src="/usdc-dark.svg"
                alt="USDC Logo"
                width={25}
                height={25}
                className="dark:hidden"
              />
              <Image
                src="/usdc.svg"
                alt="USDC Logo"
                width={25}
                height={25}
                className="hidden dark:block"
              />
              USDC
            </span>
          </div>
          <div className="additional-details">
            <h3>Liq. Loan-To-Value(LLTV)</h3>
            <span>80%</span>
          </div>
          <div className="additional-details">
            <h3>Date of Creation</h3>
            <span>1/4/2025</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;

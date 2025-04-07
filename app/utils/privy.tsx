import { arbitrumSepolia } from "viem/chains";
import { espresso } from "@/lib/espresso-chain";
import { formatUnits } from "viem";
import { format } from "path";


const proxyRpcUrl = "/api/rpc-proxy";

export const handleGetChain = (wallet) => {
  console.log("testing chain id from getChain function from helper function");
  if (!wallet) return;
  return wallet.chainId;
};

export const handleSwitchChain = async (wallet, chainId) => {
  console.log("testing chain id from getChain function from helper function");
  if (!wallet) return;
  return wallet.switchChain(chainId);
};

export const handleGetArbitrumSepoliaBalance = async (wallet) => {
  if (!wallet) return;

  try {
    if (Number(wallet.chainId) !== arbitrumSepolia.id) {
      await wallet.switchChain(arbitrumSepolia.id);
    }

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
      console.log("Balance in Wei:", balanceWei.toString());

      return formatUnits(balanceWei, 18);
    }
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
};

export const handleGetEspressoBalance = async (wallet) => {
  if (!wallet) return;

  if (Number(wallet.chainId) !== espresso.id) {
    await wallet.switchChain(arbitrumSepolia.id);
  }

  try {
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

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "RPC error");
    }

    if (data.result) {
      const balanceWei = BigInt(data.result);
      return formatUnits(balanceWei, 18);
    }
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
};

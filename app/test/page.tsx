"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { createWalletClient, custom, Hex, parseEther } from "viem";
import { espresso } from "@/lib/espresso-chain"; 
import { createPublicClient, http } from "viem";
import { formatEther } from "viem";
import { arbitrumSepolia } from "viem/chains";

export default function Page() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [walletClient, setWalletClient] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use our own proxy instead of direct RPC URL
  const proxyRpcUrl = "/api/rpc-proxy";

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
  }, [wallet]);

  const sendTransaction = async () => {
    if (!walletClient) {
      setError("Wallet client not initialized");
      return;
    }
    
    setLoading(true);
    try {
      const [address] = await walletClient.getAddresses();
      const hash = await walletClient.sendTransaction({
        account: address,
        to: "0x49c4f4b258B715A4d50e6642F325946e62A6B7bA",
        value: parseEther("0.001"),
      });
      console.log("Transaction hash:", hash);
      setError(null);
    } catch (error) {
      console.error("Transaction error:", error);
      setError("Transaction failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getWalletBalance = async () => {
    if (!wallet || !wallet.address) {
      setError("No wallet connected");
      return;
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [wallet.address, 'latest'],
        }),
      });

      console.log("chainId is", wallet.chainId);
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error.message || 'RPC error');
      }
  
      if (data.result) {
        const balanceWei = BigInt(data.result);  // Keep full precision in Wei
        console.log("Balance in Wei:", balanceWei.toString());  // Full balance without loss
        setBalance(balanceWei);  // Convert to Ether for display
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch balance: " + error.message);
    } finally {
      setLoading(false);
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
      // Check if the wallet is connected to the correct chain
      if (wallet.chainId !== arbitrumSepolia.id) {
        // Switch to Arbitrum Sepolia if not already connected
        await wallet.switchChain(arbitrumSepolia.id);
      }
  
      console.log("Chain ID is", wallet.chainId);
  
      // Use the RPC endpoint for Arbitrum Sepolia
      const rpcUrl = arbitrumSepolia.rpcUrls.default.http[0];
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [wallet.address, 'latest'],
        }),
      });
  
      // Log the raw response text for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);
  
      // Parse the JSON response
      const data = JSON.parse(responseText);
  
      if (data.error) {
        throw new Error(data.error.message || 'RPC error');
      }
  
      if (data.result) {
        const balanceWei = BigInt(data.result);  // Keep full precision in Wei
        console.log("Balance in Wei:", balanceWei.toString());  // Full balance without loss
        setBalance(balanceWei);  // Convert to Ether for display
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch balance: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  
  const handleChangeToEspresso = async () => {
    if (!wallet) {
      setError("No wallet connected");
      return;
    }
    
    setLoading(true);
    try {
      await wallet.switchChain(espresso.id);
      console.log("Switched to Espresso Network", espresso.id, espresso.rpcUrls.default);
      setError(null);
    } catch (error) {
      console.error("Error switching to Espresso:", error);
      setError("Failed to switch network: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentChain = async () => {
    console.log("current chain", wallet.chainId);
  }
  if (!ready) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {authenticated ? (
        <button className="bg-red-500 text-white px-4 py-2 rounded mb-4" onClick={logout} disabled={loading}>
          Disconnect Wallet
        </button>
      ) : (
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4" 
          onClick={login} 
          disabled={!ready || loading}
        >
          Connect Wallet
        </button>
      )}
      
      {authenticated && (
        <div className="flex gap-2 mb-4">
          <button 
            className="bg-purple-500 text-white px-4 py-2 rounded" 
            onClick={handleChangeToEspresso}
            disabled={loading}
          >
            Switch to Espresso
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded" 
            onClick={sendTransaction}
            disabled={loading}
          >
            Send Transaction
          </button>
          <button 
            className="bg-yellow-500 text-white px-4 py-2 rounded" 
            onClick={getWalletBalance}
            disabled={loading}
          >
            Get Balance
          </button>
            <button onClick={handleCurrentChain}>get current chain</button>
          <button onClick={getArbitrumSepoliaBalance}>get balance on arbitrum
          </button>
        </div>
      )}
      
      {loading && (
        <div className="text-blue-500 mb-4">Loading...</div>
      )}
      
      {wallet && (
        <div className="border p-4 rounded mb-4">
          <div><strong>Wallet Address:</strong> {wallet.address}</div>
          <div><strong>Chain ID:</strong> {wallet.chainId}</div>
          {balance && <div><strong>Balance:</strong> {balance}</div>}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
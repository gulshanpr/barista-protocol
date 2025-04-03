"use client";

import { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Image from "next/image";
import ThemeToggle from "@/theme/theme-toggle";
import Link from "next/link";
import Bridge from "./Bridge";
import { espresso } from "@/lib/espresso-chain";
import { toast } from "sonner";

// Define links for navigation
const links = [
  { name: "Home", href: "/" },
  { name: "Lend", href: "/lend" },
  { name: "Borrow", href: "/borrow" },
];

const Header = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Assuming only the first wallet is used
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  // Set wallet address when authenticated
  useEffect(() => {
    if (wallet) {
      setWalletAddress(wallet.address);
    }
  }, [wallet]);

  // Get the current chain ID
  useEffect(() => {
    const getChainId = async () => {
      if (wallet) {
        try {
          const chain = await wallet.chainId;
          setCurrentChainId(Number(chain));
        } catch (error) {
          console.error("Error fetching chain ID:", error);
        }
      }
    };
    getChainId();
  }, [wallet]);

  // Function to switch the chain
  const switchChain = async (chainId: number) => {
    if (!wallet) return;
    try {
      await wallet.switchChain(chainId);
      console.log(`Successfully switched to chain ID: ${chainId}`);
      setCurrentChainId(chainId); // Update local state
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  const handleNavigation = (href: string) => {
    if (!authenticated) {
      toast.error("You must be connected to a wallet to access this page.");
    } else {
      window.location.href = href;
    }
  };

  return (
    <header className="px-2 md:px-9 py-2 rounded-xl border-b-2 border-coffee dark:border-cream">
      <nav className="flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={75}
            height={75}
            priority
            className="-translate-y-1.5 dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            alt="Logo"
            width={75}
            height={75}
            priority
            className="-translate-y-1.5 dark:block hidden"
          />
          <span className="text-xl font-bold uppercase">Barista Protocol</span>
        </Link>

        <ul className="flex font-semibold items-center">
          {links.map((link) => (
            <li key={link.name} className="hidden lg:flex text-lg items-center">
              {link.name === "Lend" || link.name === "Borrow" ? (
                <button
                  onClick={() => handleNavigation(link.href)}
                  className="hover-underline relative text-coffee dark:text-cream px-4 py-2 transition-all cursor-pointer after:bg-coffee dark:after:bg-cream">
                  {link.name}
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="hover-underline relative text-coffee dark:text-cream px-4 py-2 transition-all cursor-pointer after:bg-coffee dark:after:bg-cream">
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-coffee dark:bg-cream rounded-full">
                <Image
                  src="/ethereum.svg"
                  alt="Ethereum Logo"
                  width={20}
                  height={20}
                  className="dark:hidden"
                />
                <Image
                  src="/ethereum-dark.svg"
                  alt="Ethereum Logo"
                  width={20}
                  height={20}
                  className="hidden dark:block"
                />
              </div>
              <div className="bg-coffee text-cream dark:bg-cream dark:text-coffee px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer">
                <p className="font-semibold truncate max-w-[5rem]">
                  {walletAddress || "No wallet connected"}
                </p>
              </div>

              {/* Show 'Switch Network' button only if on wrong chain */}
              {currentChainId !== espresso.id && (
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer"
                  onClick={() => switchChain(espresso.id)}>
                  Switch Network
                </button>
              )}

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer"
                onClick={logout}>
                Disconnect
              </button>
            </div>
          ) : (
            <button
              className="bg-coffee text-cream px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer dark:bg-cream dark:text-coffee hover:bg-coffee/70 dark:hover:bg-cream/70"
              onClick={login}
              disabled={!ready}>
              Connect Wallet
            </button>
          )}
          <Bridge />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;

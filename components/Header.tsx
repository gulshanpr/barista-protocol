"use client";

import { useState } from "react";
import Image from "next/image";
import ThemeToggle from "@/theme/theme-toggle";
import Link from "next/link";
import Bridge from "./Bridge";

const links = [
  { name: "Home", href: "/" },
  { name: "Lend", href: "/lend" },
  { name: "Borrow", href: "/borrow" },
];

const Header = () => {
  const [wallet, setWallet] = useState(false);

  return (
    <header className="px-2 md:px-9 py-2 rounded-xl border-b-2 border-coffee dark:border-cream ">
      <nav className=" flex flex-col sm:flex-row justify-between items-center ">
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
              <Link
                href={link.href}
                className="hover-underline relative text-coffee dark:text-cream px-4 py-2 transition-all cursor-pointer after:bg-coffee dark:after:bg-cream">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          {wallet ? (
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
              <div className=" bg-coffee text-cream dark:bg-cream dark:text-coffee px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer">
                <p className=" font-semibold truncate max-w-[5rem]">
                  <span>0x1234567890abcdef1234567890abcdef12345678</span>
                </p>
              </div>
            </div>
          ) : (
            <button
              className="bg-coffee text-cream px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer dark:bg-cream dark:text-coffee hover:bg-coffee/70 dark:hover:bg-cream/70"
              onClick={() => setWallet(!wallet)}>
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

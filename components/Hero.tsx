"use client";

import { Download, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { usePrivy } from "@privy-io/react-auth";

const Hero = () => {
  const { ready, authenticated } = usePrivy();

  const handleNavigation = (href: string) => {
    if (!ready) {
      toast.error("Please wait while we verify your authentication status.");
      return;
    }

    if (!authenticated) {
      toast.error("You must be connected to a wallet to access this page.");
    } else {
      window.location.href = href;
    }
  };

  return (
    <section className="px-4 md:px-10 py-20 md:pt-10 md:pb-0 flex flex-col md:flex-row items-center justify-between lg:w-[95%] mx-auto">
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl text-center md:text-left md:text-5xl lg:text-7xl font-bold md:max-w-[55rem]">
          Brew Your Future Across Chains
        </h1>
        <p className="md:max-w-[55rem] text-center md:text-left">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ducimus alias in minima
          officiis accusamus beatae labore animi, atque dolor asperiores laborum ea nesciunt ipsa
          impedit modi optio quam quasi!
        </p>
        <div className="flex gap-3 justify-center items-center md:justify-start">
          <button
            onClick={() => handleNavigation("/lend")}
            className="border-2 rounded-lg px-10 py-2 font-bold bg-coffee text-cream hover:bg-coffee/60 transition-colors dark:bg-cream dark:text-coffee dark:hover:bg-cream/60 dark:border-cream border-coffee flex items-center gap-2">
            <Upload />
            Lend
          </button>
          <button
            onClick={() => handleNavigation("/borrow")}
            className="border-2 rounded-lg px-10 py-2 font-bold border-coffee hover:bg-coffee hover:text-cream transition-colors dark:hover:bg-cream dark:hover:text-coffee dark:border-cream flex items-center gap-2">
            <Download />
            Borrow
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={500}
          height={500}
          priority
          className="dark:hidden"
        />
        <Image
          src="/logo-dark.svg"
          alt="Logo"
          width={500}
          height={500}
          priority
          className="dark:block hidden"
        />
      </div>
    </section>
  );
};
export default Hero;

import { ArrowDownUp, Fuel, Repeat } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";

const Bridge = () => {
  const [networks, setNetworks] = useState(["Ethereum", "USDC"]);

  const handleSwap = () => {
    setNetworks((prev) => [prev[1], prev[0]]);
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
                <span className="text-sm">Network</span>
                <span className="font-bold">{networks[0]}</span>
              </div>
              <Image
                src={networks[0] === "Ethereum" ? "/ethereum-dark.svg" : "/usdc.svg"}
                alt={networks[0]}
                width={24}
                height={24}
                className="dark:hidden"
              />
              <Image
                src={networks[0] === "Ethereum" ? "/ethereum.svg" : "/usdc.svg"}
                alt={networks[0]}
                width={24}
                height={24}
                className="hidden dark:block"
              />
            </div>
            <button
              onClick={handleSwap}
              className="absolute top-[35%] left-1/2 right-1/2 z-10 bg-coffee text-cream px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer dark:bg-cream dark:text-coffee border border-cream dark:border-coffee flex justify-center hover:opacity-90">
              <ArrowDownUp size={16} className="flex-shrink-0" />
              <span className="sr-only">Swap</span>
            </button>
            <div className="flex items-center justify-between bg-cream dark:bg-coffee text-coffee dark:text-cream px-4 py-2 rounded">
              <div className="flex flex-col gap-1">
                <span className="text-sm">Network</span>
                <span className="font-bold">{networks[1]}</span>
              </div>
              <Image
                src={networks[1] === "Ethereum" ? "/ethereum-dark.svg" : "/usdc.svg"}
                alt={networks[1]}
                width={24}
                height={24}
                className="dark:hidden"
              />
              <Image
                src={networks[1] === "Ethereum" ? "/ethereum.svg" : "/usdc-dark.svg"}
                alt={networks[1]}
                width={24}
                height={24}
                className="hidden dark:block"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="relative flex flex-col">
              <label htmlFor="amount" className="font-semibold">
                Amount to Bridge
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                className="w-full bg-cream dark:bg-coffee text-coffee dark:text-cream px-4 pt-2 pb-1 rounded-t mt-2 text-2xl focus:outline-none focus:ring-2 focus:ring-coffee dark:focus:ring-cream placeholder:text-coffee dark:placeholder:text-cream font-medium"
                placeholder="0.00"
              />
              <span className="text-sm bg-cream dark:bg-coffee text-coffee dark:text-cream w-full rounded-b pl-3.5 pb-1">
                $0
              </span>
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
                placeholder="0x1234567890abcdef1234567890abcdef12345678"></input>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Transaction Overview</p>
            <div className="bg-cream dark:bg-coffee text-coffee dark:text-cream rounded px-3 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Amount</span>
                <span className="">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Fuel size={16} />
                  <span className="text-sm">Fee</span>
                </div>
                <span className="">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Amount After Fee</span>
                <span className="">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm ">Estimated Time</span>
                <span className="">in 16 minutes</span>
              </div>
            </div>
          </div>
          <button className="bg-cream  text-coffee px-4 py-2 rounded font-medium hover:opacity-65 transition-all cursor-pointer dark:bg-coffee dark:text-cream flex items-center justify-center mt-4 w-full">
            <Repeat className="mr-2" size={16} />
            Bridge
          </button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Bridge;

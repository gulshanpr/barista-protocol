import DashboardWidgets from "@/components/DashboardWidgets";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <main className="flex flex-col gap-10 py-10">
      <DashboardWidgets
        container="grid-cols-1 md:grid-cols-4 gap-2 p-4 hidden md:grid"
        wrapper="bg-coffee dark:bg-cream text-cream dark:text-coffee "
      />
      <div className="px-9">
        <span className="font-bold text-2xl">Coins</span>
        <div className="text-lg">
          <div className="px-3 font-bold flex justify-between border-y-2 border-coffee dark:border-cream py-2">
            <span>Asset Name</span>
            <span>Price</span>
            <span>Total Supply</span>
            <span>APY</span>
          </div>

          <div>
            <Link
              href="/lend/eth"
              className="px-3 flex justify-between items-center py-2 table-row-1 hover:bg-coffee/10 hover:dark:bg-cream/10 transition-all">
              <span className="font-medium flex items-center gap-2">
                <Image
                  src="/ethereum-dark.svg"
                  alt="coin"
                  width={20}
                  height={20}
                  className="dark:hidden"
                />
                <Image
                  src="/ethereum.svg"
                  alt="coin"
                  width={20}
                  height={20}
                  className="hidden dark:block"
                />
                ETH
              </span>
              <span className="ml-8">$1,654</span>
              <span className="">$60.500M</span>
              <span>45%</span>
            </Link>

            <Link
              href="/lend/usdc"
              className="px-3 flex justify-between items-center py-2 table-row-1 hover:bg-coffee/10 hover:dark:bg-cream/10 transition-all">
              <span className="font-medium flex items-center gap-2">
                <Image src="/usdc.svg" alt="coin" width={20} height={20} className="dark:hidden" />
                <Image
                  src="/usdc-dark.svg"
                  alt="coin"
                  width={20}
                  height={20}
                  className="hidden dark:block"
                />
                USDC
              </span>
              <span>$34,233</span>
              <span>$40M</span>
              <span>250%</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
export default page;

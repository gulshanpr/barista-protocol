import Image from "next/image";

const page = () => {
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
            <div className="bg-coffee dark:bg-cream rounded-lg p-5 flex flex-col gap-5 dark:text-coffee text-cream text-xl">
              <h3 className="pl-1">Supply Collateral</h3>
              <input
                type="number"
                placeholder="0.00"
                min={0}
                className="bg-coffee dark:bg-cream rounded-lg p-5 flex flex-col gap-5 text-cream placeholder:text-2xl
                border border-cream dark:border-coffee dark:placeholder:text-coffee"
              />
              <span className="pl-1">$0</span>
            </div>
            <div className="bg-coffee dark:bg-cream rounded-lg p-5 flex flex-col gap-5 dark:text-coffee text-cream text-xl">
              <h3 className="pl-1">Borrow</h3>
              <input
                type="number"
                placeholder="0.00"
                min={0}
                className="bg-coffee dark:bg-cream rounded-lg p-5 flex flex-col gap-5  text-cream placeholder:text-2xl
                  border border-cream dark:border-coffee dark:placeholder:text-coffee"
              />
              <span className="pl-1">$0</span>
            </div>
            <button
              className="col-span-2
            bg-coffee dark:bg-cream rounded-lg p-4 flex flex-col gap-5 text-cream dark:text-coffee text-xl hover:opacity-85 cursor-pointer transition-all">
              Borrow
            </button>
          </div>
        </div>
        <div>
          <div className="additional-details">
            <h3>Collateral Token</h3>
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
              ETH
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
export default page;

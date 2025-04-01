import ThemeToggle from "@/theme/theme-toggle";
import Image from "next/image";

const Header = () => {
  return (
    <header>
      <nav className="container mx-auto px-4 py-2 flex justify-between items-center border-b-2 border-coffee dark:border-cream rounded-xl">
        <div className="flex items-center">
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
          <span className="text-xl font-bold">Barista Protocol</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-coffee text-cream px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all cursor-pointer dark:bg-cream dark:text-coffee hover:bg-coffee/70 dark:hover:bg-cream/70">
            Connect Wallet
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
export default Header;

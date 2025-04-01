import Dashboard from "@/components/Dashboard";
import Hero from "@/components/Hero";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-17">
        <Hero />
        <Dashboard />
      </main>
      <footer className="py-2">
        <Link
          href="https://github.com/prajalsharma/Barista-Protocol"
          className="flex justify-center font-medium underline text-lg gap-2">
          <Image
            src="/github.svg"
            alt="github"
            width={25}
            height={25}
            priority
            className="dark:hidden"
          />
          <Image
            src="/github-dark.svg"
            alt="github"
            width={25}
            height={25}
            priority
            className="dark:block hidden"
          />
          Github
        </Link>
      </footer>
    </>
  );
}

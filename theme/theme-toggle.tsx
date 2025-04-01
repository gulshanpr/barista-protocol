"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="cursor-pointer rounded-md border-2 border-coffee px-3 py-1.5 flex gap-2 items-center justify-center transition-colors font-bold hover:bg-coffee hover:text-cream dark:hover:bg-cream dark:hover:text-coffee dark:border-cream"
      title="Toggle theme"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <div className="items-center gap-2 hidden dark:flex ">
        <Sun className="size-5" />
        <span className="hidden md:block">Crema</span>
      </div>
      <div className="flex items-center gap-2 dark:hidden">
        <Moon className="size-5" />
        <span className="hidden md:block">Espresso</span>
      </div>
    </button>
  );
}

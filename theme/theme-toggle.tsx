"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className="cursor-pointer rounded-md border-2 border-coffee px-3 py-1.5 flex gap-2 items-center justify-center transition-colors font-bold hover:bg-coffee hover:text-cream dark:hover:bg-cream dark:hover:text-coffee dark:border-cream"
      title="Toggle theme"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? (
        <>
          <Sun className="size-5" />
          <span>Creama</span>
        </>
      ) : (
        <>
          <Moon className="size-5" />
          <span>Espresso</span>
        </>
      )}
    </button>
  );
}

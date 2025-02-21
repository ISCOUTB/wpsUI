"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

export default function DarkTheme() {
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkTheme(true);
  }, []);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkTheme]);

  return (
    <div
      className="w-10 h-10 flex items-center justify-center border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full cursor-pointer transition-colors"
      onClick={() => setDarkTheme(!darkTheme)}
    >
      {darkTheme ? <SunIcon /> : <MoonIcon />}
    </div>
  );
}

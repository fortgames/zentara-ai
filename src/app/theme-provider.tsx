"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Only declare Theme type once in your project
export type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Set theme on mount, default to dark, ignore system settings
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("theme") as Theme | null;
      setTheme(stored === "light" || stored === "dark" ? stored : "dark");
    }
  }, []);

  React.useEffect(() => {
    if (theme) {
      const root = window.document.documentElement;
      // Remove both classes first
      root.classList.remove("light", "dark");
      // Add the current theme class
      root.classList.add(theme);
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggle = () => setTheme(t => (t === "light" ? "dark" : "light"));

  // Prevent rendering until theme is known (avoids hydration flicker)
  if (!theme) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

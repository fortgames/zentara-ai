"use client";
import { useTheme } from "../theme-provider";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { createClient } from "../backend/lib/utils/supabase/client";
import { useRouter } from "next/navigation";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button onClick={toggle} color={theme === "dark" ? "primary" : "default"} variant="flat">
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </Button>
  );
}

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);

    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();

    return () => window.removeEventListener("scroll", onScroll);
  }, [supabase.auth]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  }

  return (
    <header
      className={`flex justify-between items-center px-8 py-6 w-full max-w-6xl mx-auto sticky top-0 z-10 transition-all duration-500
        ${scrolled ? "bg-white/60 dark:bg-gray-950/60 backdrop-blur-lg glassmorphism" : "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"}
      `}
      style={{ background: scrolled ? undefined : "var(--card)", color: "var(--card-foreground)" }}
    >
      <a href="/" className="text-2xl font-bold tracking-tight" style={{ color: "var(--primary)", textDecoration: "none" }}>zentara</a>
      <div className="flex gap-4 items-center">
        <a href="/contact" className="text-sm hover:underline" style={{ color: "var(--foreground)" }}>Contact sales</a>
        {user ? (
          <Button onClick={handleSignOut} color="primary" className="font-semibold">Sign Out</Button>
        ) : (
          <>
            <Button as="a" href="/signin" color="primary" variant="flat" className="font-semibold">Sign In</Button>
            <Button as="a" href="/signup" color="primary" className="font-semibold">Sign up</Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

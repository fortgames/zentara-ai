"use client";
import AppHeader from "../components/AppHeader";
import { useEffect, useState } from "react";
import { createClient } from "../backend/lib/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/signin");
      } else {
        setUser({ id: data.user.id, email: data.user.email ?? "" });
      }
      setLoading(false);
    }
    getUser();
  }, [supabase.auth, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-center">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-2xl bg-[var(--card)] rounded-3xl shadow-lg p-8 animate-fade-in-up mt-8">
          <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--primary)" }}>User Dashboard</h1>
          <p className="text-lg text-center mb-4" style={{ color: "var(--muted-foreground)" }}>
            Welcome to your dashboard! Here you can view your activity, manage your account, and access personalized features.
          </p>
          {/* Add user-specific dashboard content here */}
        </div>
      </main>
    </>
  );
}

"use client";
import { Button } from "@nextui-org/react";
import AppHeader from "../components/AppHeader";
import { useState } from "react";
import { createClient } from "../backend/lib/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(form.email);
  const passwordValid = form.password.length > 0;
  const isValid = emailValid && passwordValid;

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { email, password } = form;
    const supabase = createClient();

    if (email !== "softwaresfortress@gmail.com" || password !== "zentara2025inc") {
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-md bg-[var(--card)] rounded-3xl shadow-lg p-8 animate-fade-in-up mt-8">
          <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--primary)" }}>Admin Login</h1>
          <form className="flex flex-col gap-4" onSubmit={handleAdminLogin}>
            <div className="relative">
              <input
                type="email"
                placeholder="Admin Email"
                className={`px-4 py-3 rounded-xl border bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:opacity-100 w-full ${touched.email && !emailValid ? 'border-red-500' : 'border-[var(--border)]'}`}
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                inputMode="email"
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`px-4 py-3 rounded-xl border bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:opacity-100 w-full ${touched.password && !passwordValid ? 'border-red-500' : 'border-[var(--border)]'}`}
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "View"}
              </button>
            </div>
            <Button
              color="primary"
              className="w-full font-semibold rounded-xl mt-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-base py-3"
              type="submit"
              disabled={!isValid || loading}
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {loading ? "Logging In..." : "Login"}
            </Button>
            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
          </form>
        </div>
      </main>
    </>
  );
}

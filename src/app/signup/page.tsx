"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import AppHeader from "../components/AppHeader";
import { useState } from "react";
import { createClient } from "../backend/lib/utils/supabase/client";

export default function SignUp() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(form.email);
  const passwordValid = form.password.length > 0;
  const confirmValid = form.confirm.length > 0 && form.password === form.confirm;
  const isValid = emailValid && passwordValid && confirmValid;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const { email, password } = form;
    const supabase = createClient();
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo }
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email to confirm your account.");
        setForm({ email: "", password: "", confirm: "" });
        setTouched({ email: false, password: false, confirm: false });
        alert("successfully signed in");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred.");
    }
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-md bg-[var(--card)] rounded-3xl shadow-lg p-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--primary)" }}>Create your account</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSignup}>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
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
                autoComplete="new-password"
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
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                className={`px-4 py-3 rounded-xl border bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:opacity-100 w-full ${touched.confirm && !confirmValid ? 'border-red-500' : 'border-[var(--border)]'}`}
                required
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                tabIndex={-1}
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "Hide" : "View"}
              </button>
            </div>
            <Button
              color="primary"
              className="w-full font-semibold rounded-xl mt-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-base py-3"
              type="submit"
              disabled={!isValid || loading}
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center mt-2">{success}</div>}
          </form>
          <div className="text-center mt-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Already have an account? <Link href="/signin" className="text-[var(--primary)] font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </main>
    </>
  );
}

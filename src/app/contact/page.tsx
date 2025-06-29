"use client";
import { Button } from "@nextui-org/react";
import AppHeader from "../components/AppHeader";
import { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameValid = form.name.trim().length > 0;
  const emailValid = emailRegex.test(form.email);
  const messageValid = form.message.trim().length > 0;
  const isValid = nameValid && emailValid && messageValid;

  return (
    <>
      <AppHeader />
      <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-lg bg-[var(--card)] rounded-3xl shadow-lg p-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--primary)" }}>Contact Us</h1>
          <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); }}>
            <input
              type="text"
              placeholder="Your Name"
              className={`px-4 py-3 rounded-xl border bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:opacity-100 w-full ${touched.name && !nameValid ? 'border-red-500' : 'border-[var(--border)]'}`}
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              autoComplete="name"
            />
            <input
              type="email"
              placeholder="Your Email"
              className={`px-4 py-3 rounded-xl border bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:opacity-100 w-full ${touched.email && !emailValid ? 'border-red-500' : 'border-[var(--border)]'}`}
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              inputMode="email"
              autoComplete="email"
            />
            <textarea
              placeholder="How can we help you?"
              rows={5}
              className={`px-4 py-3 rounded-xl border bg-transparent focus:outline-none resize-none placeholder:text-gray-400 placeholder:opacity-100 w-full ${touched.message && !messageValid ? 'border-red-500' : 'border-[var(--border)]'}`}
              required
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, message: true }))}
            />
            <Button color="primary" className="w-full font-semibold rounded-xl mt-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-base py-3" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }} type="submit" disabled={!isValid}>
              Send Message
            </Button>
          </form>
          <div className="text-center mt-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
            We'll get back to you as soon as possible.
          </div>
        </div>
      </main>
    </>
  );
}

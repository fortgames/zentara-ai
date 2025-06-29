"use client";
import { useTheme } from "./theme-provider";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import { createClient } from "./backend/lib/utils/supabase/client";
import Image from "next/image";
import linkedinIcon from "./assets/icons8-linkedin-48.png";
import twitterIcon from "./assets/icons8-twitter-48.png";
import instagramIcon from "./assets/icons8-instagram-48.png";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button onClick={toggle} color={theme === "dark" ? "primary" : "default"} variant="flat">
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </Button>
  );
}

function useScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".animate-fade-in-up, .text-slide-up, .hover-animate-scale, .container-hero-hover, .button-hero-hover"
    );
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Add or update global CSS for smooth scroll animations
  if (typeof window !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
      .animate-fade-in-up, .text-slide-up, .hover-animate-scale, .container-hero-hover, .button-hero-hover {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
      }
      .in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    if (!document.head.querySelector('style[data-scroll-anim]')) {
      style.setAttribute('data-scroll-anim', 'true');
      document.head.appendChild(style);
    }
  }
}

export default function Home() {
  useScrollAnimation();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, [supabase.auth]);

  async function handleSignInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main
      className="min-h-screen transition-colors duration-700 flex flex-col items-center w-full"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <AppHeader />
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-20 w-full max-w-6xl mx-auto">
        <div className="flex-1 flex flex-col gap-6 items-start min-w-[300px]">
          <span className="px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}>New</span>
          <h1 className="text-5xl font-extrabold leading-tight mb-4 text-slide-up" style={{ color: "var(--foreground)" }}>Automate<br />without limits</h1>
          <p className="text-lg mb-6 max-w-lg text-fade-in" style={{ color: "var(--muted-foreground)" }}>
            Turn chaos into smooth operations by automating workflows yourself—no developers, no IT tickets, no delays. The only limit is your imagination.
          </p>
          <div className="flex gap-4 w-full max-w-md">
            {user ? (
              user.email === "softwaresfortress@gmail.com" ? (
                <Button
                  color="primary"
                  as="a"
                  href="/admin"
                  className="font-semibold px-6 py-3 text-base rounded-xl w-full animate-fade-in-up hover-animate-scale button-hero-hover"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)"
                  }}
                >
                  Go to Admin Dashboard
                </Button>
              ) : (
                <Button
                  color="primary"
                  as="a"
                  href="/dashboard"
                  className="font-semibold px-6 py-3 text-base rounded-xl w-full animate-fade-in-up hover-animate-scale button-hero-hover"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)"
                  }}
                >
                  Go to Dashboard
                </Button>
              )
            ) : (
              <>
                <Button
                  color="primary"
                  as="a"
                  href="/signin"
                  className="font-semibold px-6 py-3 text-base rounded-xl w-full animate-fade-in-up hover-animate-scale button-hero-hover"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)"
                  }}
                >
                  sign in with email
                </Button>
                <Button
                  variant="bordered"
                  className="font-semibold px-6 py-3 text-base rounded-xl w-full animate-fade-in-up hover-animate-scale button-hero-hover"
                  style={{
                    background: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)"
                  }}
                  onClick={handleSignInWithGoogle}
                >
                  sign in with google
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center min-w-[300px]">
          <div className="w-full max-w-md h-64 rounded-2xl border backdrop-blur-lg flex items-center justify-center animate-fade-in-up workflow-glow" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            {/* Placeholder for workflow illustration */}
            <span className="text-lg" style={{ color: "var(--muted-foreground)" }}>[Workflow Illustration]</span>
          </div>
        </div>
      </section>
      <section className="flex flex-wrap justify-center gap-6 px-8 pb-20 w-full max-w-6xl mx-auto">
        <div className="w-full mb-8">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--primary)" }}>Among the Few Things We Offer</h2>
          <p className="text-center text-lg max-w-3xl mx-auto mb-4" style={{ color: "var(--muted-foreground)" }}>
            In today's digital landscape, over 70% of companies struggle to fully leverage their data and AI potential, missing out on transformative growth and efficiency. At Zentara, we help you break through these barriers—revolutionizing your operations with cutting-edge automation, analytics, and cloud solutions. The services below are just a glimpse of what we can do. Ready to outperform your competition and future-proof your business? <span className="font-semibold text-[var(--primary)]">Contact us today</span> and discover how we can unlock your organization's true potential.
          </p>
        </div>
        {[
          { title: "AI-Powered Process Automation" },
          { title: "Custom Data Analytics & Insights" },
          { title: "Cloud Infrastructure Management" },
          { title: "Enterprise Workflow Integration" },
          { title: "Predictive Business Intelligence" },
        ].map((item, i) => (
          <div
            key={item.title}
            className={"rounded-xl px-6 py-4 min-w-[220px] max-w-xs flex-1 text-center font-semibold animate-fade-in-up flex items-center justify-center text-slide-up hover-animate-scale container-hero-hover button-hero-hover"}
            style={{
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              animationDelay: `${100 + i * 100}ms`
            }}
          >
            {item.title}
          </div>
        ))}
      </section>
      <section className="w-full max-w-6xl mx-auto px-8 pb-12">
        <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: "var(--primary)" }}>About Us</h2>
        <p className="text-lg max-w-2xl mx-auto text-center" style={{ color: "var(--muted-foreground)" }}>
          At Zentara, we empower corporate agencies to focus on what matters most—growth and innovation. Our expert team takes the complexity out of your daily operations by seamlessly managing your workflows, automating repetitive tasks, and organizing your data with precision. We believe in making work easier, faster, and smarter, so your teams can achieve more with less effort. Partner with Zentara and experience a new era of productivity, clarity, and business agility.
        </p>
      </section>
      <section className="w-full max-w-6xl mx-auto px-8 pb-16">
        <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: "var(--primary)" }}>Meet Our Leadership</h3>
        <div className="flex flex-wrap justify-center gap-10">
          {/* CEO */}
          <div className="flex flex-col items-center text-center max-w-xs bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-md workflow-glow">
            <img src="/public/ceo.jpg" alt="CEO" className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-[var(--primary)]" />
            <h4 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>Seth Situma</h4>
            <span className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>Chief Executive Officer</span>
            <p className="text-sm mb-3" style={{ color: "var(--muted-foreground)" }}>
              Visionary leader passionate about simplifying work for modern businesses.
            </p>
            <div className="flex gap-3 justify-center">
              <a href="https://linkedin.com/in/" target="_blank" rel="noopener" aria-label="LinkedIn"><Image src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" /></a>
              <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter"><Image src={twitterIcon} alt="Twitter" className="w-6 h-6" /></a>
              <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><Image src={instagramIcon} alt="Instagram" className="w-6 h-6" /></a>
            </div>
          </div>
          {/* CTO */}
          <div className="flex flex-col items-center text-center max-w-xs bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-md workflow-glow">
            <img src="/public/cto.jpg" alt="CTO" className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-[var(--primary)]" />
            <h4 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>Emmanuel Sonkori</h4>
            <span className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>Chief Technology Officer</span>
            <p className="text-sm mb-3" style={{ color: "var(--muted-foreground)" }}>
              Tech innovator driving automation and data solutions for agencies.
            </p>
            <div className="flex gap-3 justify-center">
              <a href="https://linkedin.com/in/" target="_blank" rel="noopener" aria-label="LinkedIn"><Image src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" /></a>
              <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter"><Image src={twitterIcon} alt="Twitter" className="w-6 h-6" /></a>
              <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><Image src={instagramIcon} alt="Instagram" className="w-6 h-6" /></a>
            </div>
          </div>
          {/* CMO */}
          <div className="flex flex-col items-center text-center max-w-xs bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-md workflow-glow">
            <img src="/public/cmo.jpg" alt="CMO" className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-[var(--primary)]" />
            <h4 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>George Mburu</h4>
            <span className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>Chief Marketing Officer</span>
            <p className="text-sm mb-3" style={{ color: "var(--muted-foreground)" }}>
              Marketing strategist connecting agencies to smarter solutions.
            </p>
            <div className="flex gap-3 justify-center">
              <a href="https://www.linkedin.com/in/george-mburu-5babb5236/" target="_blank" rel="noopener" aria-label="LinkedIn"><Image src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" /></a>
              <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter"><Image src={twitterIcon} alt="Twitter" className="w-6 h-6" /></a>
              <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><Image src={instagramIcon} alt="Instagram" className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
      </section>
      <footer className="text-center py-8 w-full max-w-6xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
        &copy; {new Date().getFullYear()} Zentara AI. All rights reserved.<br />
        <a href="/admin-login" className="text-[var(--primary)] font-semibold hover:underline">Admin Login</a>
      </footer>
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../backend/lib/utils/supabase/client";

function getHashError() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  if (params.get("error")) {
    return {
      error: params.get("error"),
      code: params.get("error_code"),
      description: params.get("error_description"),
    };
  }
  return null;
}

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();
  const [hashError, setHashError] = useState<null | {
    error: string | null;
    code: string | null;
    description: string | null;
  }>(null);

  useEffect(() => {
    const err = getHashError();
    if (err) {
      setHashError(err);
      return;
    }
    async function checkSession() {
      // This will process the URL hash and set the session if present
      await supabase.auth.getUser();
      // Try to refresh the session in case it's not set yet
      await supabase.auth.refreshSession();
      const { data, error } = await supabase.auth.getSession();
      if (data.session && !error) {
        router.replace("/dashboard");
      } else {
        setTimeout(checkSession, 1000); // Poll until session is available
      }
    }
    checkSession();
  }, [router, supabase]);

  if (hashError) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-center text-red-600">
          {hashError.description || "An error occurred verifying your account."}
          <br />
          <a
            href="/signup"
            className="underline text-blue-600"
          >
            Go back to sign up
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-center">Verifying your account...</div>
    </main>
  );
}

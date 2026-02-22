"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // KEEP the "known-good" calls exactly like your working version
  async function signUp() {
    setMsg("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMsg(error.message);
        return;
      }
      // If email confirmation is on, you might not be signed in yet.
      // For hackathon speed, you can turn confirmation off in Supabase Auth settings.
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function signIn() {
    setMsg("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMsg(error.message);
        return;
      }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (mode === "signup") return signUp();
    return signIn();
  }

  return (
    <main style={{ maxWidth: 420, margin: "48px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12, marginTop: 16 }}
      >
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />

        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        >
          {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Sign up"}
        </button>

        {msg ? <p style={{ color: "crimson" }}>{msg}</p> : null}
      </form>

      <button
        type="button"
        onClick={() => {
          setMsg("");
          setMode(mode === "signin" ? "signup" : "signin");
        }}
        style={{
          marginTop: 16,
          textDecoration: "underline",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </button>
    </main>
  );
}
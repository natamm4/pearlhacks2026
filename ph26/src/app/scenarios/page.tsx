"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Row = { id: string; name: string; created_at: string };

export default function ScenariosPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;

    if (!user) {
      setMsg("Not signed in. Go to /auth first.");
      return;
    }

    const { data, error } = await supabase
      .from("scenarios")
      .select("id,name,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) setMsg(error.message);
    else setRows((data as Row[]) ?? []);
  }

  async function createDemo() {
    setMsg("");
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;

    if (!user) return setMsg("Not signed in.");

    const inputs = { base_salary: 105000, state: "NC", rent_monthly: 1400 };

    const { error } = await supabase.from("scenarios").insert({
      user_id: user.id,
      name: "Demo scenario",
      inputs,
    });

    if (error) return setMsg(error.message);

    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Scenarios</h1>

      <button onClick={createDemo} style={{ padding: 10, marginTop: 12 }}>
        Create demo scenario
      </button>

      {msg ? <p style={{ color: "crimson", marginTop: 12 }}>{msg}</p> : null}

      <ul style={{ marginTop: 16 }}>
        {rows.map((r) => (
          <li key={r.id} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
            <div style={{ fontWeight: 600 }}>{r.name}</div>
            <div style={{ opacity: 0.7, fontSize: 12 }}>{r.created_at}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
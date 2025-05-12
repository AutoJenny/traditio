"use client";
import { useState } from "react";

export default function ProductReserveForm({ productSlug }: { productSlug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, productSlug }),
      });
      if (res.ok) {
        setSuccess("This item is now reserved for you for 24 hours. We'll be in touch soon!");
        setName("");
        setEmail("");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-4 items-stretch max-w-md mx-auto text-left" onSubmit={handleSubmit}>
      <label className="font-body text-sand text-sm">Name
        <input
          type="text"
          className="border border-sand rounded px-3 py-2 w-full mt-1"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      <label className="font-body text-sand text-sm">Email
        <input
          type="email"
          className="border border-sand rounded px-3 py-2 w-full mt-1"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      <button
        type="submit"
        className="bg-sand text-espresso font-bold rounded px-4 py-2 border-2 border-brass transition-colors duration-200 hover:bg-espresso hover:text-ivory mt-2"
        disabled={loading || !name || !email}
      >
        {loading ? "Reserving..." : "Reserve Now"}
      </button>
      {success && <span className="text-xs text-green-700 mt-1">{success}</span>}
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </form>
  );
} 
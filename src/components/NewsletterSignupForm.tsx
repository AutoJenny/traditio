"use client";
import { useState } from "react";

export default function NewsletterSignupForm() {
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
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSuccess("Thank you for subscribing!");
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
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email"
        className="border border-sand rounded px-3 py-2"
        aria-label="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-sand text-espresso font-bold rounded px-4 py-2 border-2 border-brass transition-colors duration-200 hover:bg-espresso hover:text-ivory"
        disabled={loading || !email}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      <span className="text-xs text-sand mt-1">We respect your privacy.</span>
      {success && <span className="text-xs text-green-700 mt-1">{success}</span>}
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </form>
  );
} 
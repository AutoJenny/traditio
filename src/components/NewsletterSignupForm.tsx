"use client";
import { useState } from "react";

export default function NewsletterSignupForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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
        setShowSuccess(true);
        setEmail("");
        setTimeout(() => setShowSuccess(false), 2000);
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
    <form className="flex flex-col gap-2 relative" onSubmit={handleSubmit} autoComplete="off">
      <div className="relative flex items-center">
        <input
          type="email"
          placeholder="Your email"
          className="border border-sand rounded px-3 py-2 pr-32"
          aria-label="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        {showSuccess && (
          <span className="absolute right-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 ml-2 animate-fade-in-out" style={{top: '50%', transform: 'translateY(-50%)'}} role="status" aria-live="polite">
            {success}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="bg-sand text-espresso font-bold rounded px-4 py-2 border-2 border-brass transition-colors duration-200 hover:bg-espresso hover:text-ivory"
        disabled={loading || !email}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      <span className="text-xs text-sand mt-1">We respect your privacy.</span>
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </form>
  );
} 
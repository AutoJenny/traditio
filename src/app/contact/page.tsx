"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pageUrl: window.location.pathname }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-espresso mb-6">Contact Us</h1>
      <section className="mb-10">
        <p className="font-body text-lg text-sand mb-6">
          We love hearing from you! Whether you have a question, need advice, or just want to say hello, our team is always happy to help. Send us a message and we'll get back to you as soon as we can.
        </p>
      </section>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">Thank you for your message! We'll be in touch soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-sand-50 p-6 rounded shadow">
          <div>
            <label className="block font-bold mb-1" htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block font-bold mb-1" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-bold mb-1" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block font-bold mb-1" htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} className="w-full border rounded p-2" rows={4} required />
          </div>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="bg-brass text-espresso font-bold rounded px-6 py-2 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition">{loading ? "Sending..." : "Send"}</button>
        </form>
      )}
    </main>
  );
} 
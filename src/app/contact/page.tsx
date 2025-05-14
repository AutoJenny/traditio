"use client";
import { useState } from "react";
import ContactForm from '../../components/ContactForm';

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
      <ContactForm />
    </main>
  );
} 
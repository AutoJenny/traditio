"use client";
import { useState } from "react";
import countryCodes from "./countryCodes";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    setPhoneError("");
    // Phone validation
    const localNumber = phone.replace(/^0+/, "");
    const digitsOnly = localNumber.replace(/\D/g, "");
    if (!countryCode) {
      setPhoneError("Please select a country code.");
      setLoading(false);
      return;
    }
    if (digitsOnly.length < 6 || digitsOnly.length > 13) {
      setPhoneError("Phone number must be 6-13 digits (excluding country code and leading zeros).");
      setLoading(false);
      return;
    }
    const fullNumber = countryCode + digitsOnly;
    if (fullNumber.replace(/\D/g, "").length > 15) {
      setPhoneError("Full phone number (including country code) must be at most 15 digits.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: fullNumber, message }),
      });
      if (res.ok) {
        setSuccess("Thank you for your message! We'll be in touch soon.");
        setName("");
        setEmail("");
        setMessage("");
        setPhone("");
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
      <label className="font-body text-sand text-sm">Name<span className="text-red-600">*</span>
        <input
          type="text"
          className="border border-sand rounded px-3 py-2 w-full mt-1"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      <label className="font-body text-sand text-sm">Email<span className="text-red-600">*</span>
        <input
          type="email"
          className="border border-sand rounded px-3 py-2 w-full mt-1"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      <label className="font-body text-sand text-sm">Message<span className="text-red-600">*</span>
        <textarea
          className="border border-sand rounded px-3 py-2 w-full mt-1 min-h-[100px]"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      <label className="font-body text-sand text-sm">Phone
        <div className="flex gap-2 mt-1">
          <select
            className="border border-sand rounded px-2 py-2 bg-white min-w-[90px]"
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
            disabled={loading}
          >
            {countryCodes.map((c) => (
              <option key={`${c.code}-${c.name}`} value={c.code}>{c.flag} {c.code} {c.name}</option>
            ))}
          </select>
          <input
            type="tel"
            className="border border-sand rounded px-3 py-2 w-full"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="Phone number"
            disabled={loading}
          />
        </div>
        {phoneError && <span className="text-xs text-red-600 mt-1 block">{phoneError}</span>}
      </label>
      <button
        type="submit"
        className="bg-sand text-espresso font-bold rounded px-4 py-2 border-2 border-brass transition-colors duration-200 hover:bg-espresso hover:text-ivory mt-2"
        disabled={loading || !name || !email || !message || !phone || phoneError}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
      {success && <span className="text-xs text-green-700 mt-1">{success}</span>}
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </form>
  );
} 
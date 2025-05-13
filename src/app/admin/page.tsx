"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLanding() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-espresso mb-8">Admin Dashboard</h1>
      <div className="flex flex-col gap-6 items-center">
        <Link href="/admin/products" className="bg-brass text-espresso font-bold rounded px-8 py-4 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition text-2xl w-full max-w-xs flex items-center justify-center gap-4">
          <span className="inline-block align-middle">
            {/* Products Icon: Grid/Box */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </span>
          Manage Products
        </Link>
        <Link href="/admin/messages" className="bg-brass text-espresso font-bold rounded px-8 py-4 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition text-2xl w-full max-w-xs flex items-center justify-center gap-4">
          <span className="inline-block align-middle">
            {/* Messages Icon: Envelope */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>
          </span>
          View Messages
        </Link>
        <Link href="/admin/customers" className="bg-brass text-espresso font-bold rounded px-8 py-4 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition text-2xl w-full max-w-xs flex items-center justify-center gap-4">
          <span className="inline-block align-middle">
            {/* Customers Icon: Users/Group */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          View Customers
        </Link>
      </div>
    </main>
  );
} 
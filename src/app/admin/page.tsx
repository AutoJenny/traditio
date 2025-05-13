"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLanding() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-espresso mb-8">Admin Dashboard</h1>
      <div className="flex flex-col gap-6 items-center">
        <Link href="/admin/products" className="bg-brass text-espresso font-bold rounded px-8 py-4 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition text-2xl w-full max-w-xs">Manage Products</Link>
        <Link href="/admin/messages" className="bg-brass text-espresso font-bold rounded px-8 py-4 border-2 border-brass shadow hover:bg-espresso hover:text-ivory transition text-2xl w-full max-w-xs">View Messages</Link>
        <Link href="/admin/customers" className="bg-sand-500 text-white font-bold rounded px-8 py-4 border-2 border-sand-500 shadow hover:bg-espresso hover:text-ivory transition text-2xl w-full max-w-xs">View Customers</Link>
      </div>
    </main>
  );
} 
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const [newsletterFilter, setNewsletterFilter] = useState<'all' | 'newsletter' | 'non-newsletter'>('all');

  useEffect(() => {
    async function fetchCustomers() {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  let sortedCustomers = [...customers];
  if (newsletterFilter === 'newsletter') {
    sortedCustomers = sortedCustomers.filter(c => c.newsletter);
  } else if (newsletterFilter === 'non-newsletter') {
    sortedCustomers = sortedCustomers.filter(c => !c.newsletter);
  }
  if (sort === "az") {
    sortedCustomers.sort((a, b) => (a.name || a.email || "").localeCompare(b.name || b.email || ""));
  } else {
    sortedCustomers.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-espresso mb-8">Admin: Customers</h1>
      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold text-sand-700">Sort by:</label>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="latest">Latest</option>
          <option value="az">A-Z</option>
        </select>
        <label className="font-semibold text-sand-700 ml-6">Filter:</label>
        <select
          value={newsletterFilter}
          onChange={e => setNewsletterFilter(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="newsletter">Newsletter Only</option>
          <option value="non-newsletter">Non-Newsletter</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-sand text-espresso">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Joined</th>
              <th className="p-2 text-left">Updated</th>
              <th className="p-2 text-center">Messages</th>
              <th className="p-2 text-left">Newsletter</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((cust: any) => (
              <tr key={cust.id} className="border-b border-sand hover:bg-sand-100 cursor-pointer transition" onClick={() => window.location.href = `/admin/customers/${cust.id}`} tabIndex={0} role="button" aria-label={`View customer ${cust.name || cust.email}`}>
                <td className="p-2">{cust.name || <span className="text-sand-400 italic">(No name)</span>}</td>
                <td className="p-2">{cust.email}</td>
                <td className="p-2 whitespace-nowrap">{cust.created ? new Date(cust.created).toISOString().slice(0,10) : ""}</td>
                <td className="p-2 whitespace-nowrap">{cust.updated ? new Date(cust.updated).toISOString().slice(0,10) : ""}</td>
                <td className="p-2 text-center">{cust.messages ? cust.messages.length : 0}</td>
                <td className="p-2 text-center">{cust.newsletter ? <span title="Newsletter subscriber" className="text-green-600 text-lg">✔️</span> : <span className="text-sand-400">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
} 
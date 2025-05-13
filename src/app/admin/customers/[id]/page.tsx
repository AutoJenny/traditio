"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      setCustomer(data);
      setLoading(false);
    }
    fetchCustomer();
  }, [id]);

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : customer ? (
        <>
          <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-espresso mb-4">{customer.name || customer.email}</h1>
          <div className="mb-2 text-sand-700">{customer.email}</div>
          <div className="mb-4 text-sand-500 text-sm">Joined: {customer.created ? new Date(customer.created).toLocaleString() : ""} | Updated: {customer.updated ? new Date(customer.updated).toLocaleString() : ""}</div>
          <h2 className="text-xl font-bold text-brass mb-2 mt-8">Messages</h2>
          <ul className="space-y-3">
            {customer.messages && customer.messages.length > 0 ? (
              customer.messages.map((msg: any) => (
                <li key={msg.id} className="bg-sand-50 rounded p-3">
                  <div className="text-sm text-sand-700 mb-1">{msg.created ? new Date(msg.created).toLocaleString() : ""}</div>
                  <div className="mb-1">{msg.content}</div>
                  <div className="text-xs text-sand-500">{msg.productSlug ? `Product: ${msg.productSlug}` : ""} {msg.pageUrl ? `| Page: ${msg.pageUrl}` : ""}</div>
                </li>
              ))
            ) : (
              <li className="text-sand-400 italic">No messages</li>
            )}
          </ul>
        </>
      ) : (
        <div className="text-center py-16 text-red-600">Customer not found.</div>
      )}
    </main>
  );
} 
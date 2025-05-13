"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDatabasePage() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSchema() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/db");
        if (!res.ok) throw new Error("Failed to fetch DB schema");
        const data = await res.json();
        setTables(data.tables || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchSchema();
  }, []);

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-espresso mb-8 text-center">Database Schema</h1>
      <Link href="/admin" className="text-sand-600 hover:underline">&larr; Back to Admin</Link>
      {loading ? (
        <div className="text-center py-16">Loading database schema...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : (
        <div className="mt-8 space-y-8">
          {tables.map((table) => (
            <div key={table.name} className="border rounded-lg shadow bg-white p-6">
              <h2 className="text-xl font-bold text-brass mb-2">{table.name}</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-sand text-espresso">
                    <th className="p-2 text-left">Field</th>
                    <th className="p-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col: any) => (
                    <tr key={col.name} className="border-b border-sand">
                      <td className="p-2 font-mono">{col.name}</td>
                      <td className="p-2 font-mono text-sand-700">{col.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 
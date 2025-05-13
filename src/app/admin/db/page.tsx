"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

export default function AdminDatabasePage() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [rowIndexes, setRowIndexes] = useState<{ [key: string]: number }>({});

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

  const toggleAccordion = (tableName: string) => {
    setOpen((prev) => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-espresso mb-8 text-center">Database Schema</h1>
      <Link href="/admin" className="text-sand-600 hover:underline">&larr; Back to Admin</Link>
      {loading ? (
        <div className="text-center py-16">Loading database schema...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : (
        <div className="mt-8 space-y-4">
          {tables.map((table) => (
            <div key={table.name} className="border rounded-lg shadow bg-white">
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-xl font-bold text-brass focus:outline-none focus:ring-2 focus:ring-brass transition-colors duration-200 hover:bg-sand-100 rounded-t-lg"
                onClick={() => toggleAccordion(table.name)}
                aria-expanded={!!open[table.name]}
                aria-controls={`table-${table.name}`}
              >
                <span>{table.name === 'Source' ? 'Supplier' : table.name}</span>
                <span className={`transform transition-transform duration-200 ${open[table.name] ? 'rotate-90' : ''}`}>▶</span>
              </button>
              {open[table.name] && (
                <div id={`table-${table.name}`} className="px-6 pb-6 pt-2">
                  <table className="w-full border-collapse mb-4 table-fixed">
                    <thead>
                      <tr className="bg-sand text-espresso">
                        <th className="p-2 text-left w-[20%]">Field</th>
                        <th className="p-2 text-left w-[40%]">Type</th>
                        <th className="p-2 text-left w-[40%]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Row:</span>
                            <button
                              className="p-1 rounded hover:bg-sand-200 disabled:opacity-50"
                              onClick={() => setRowIndexes(idx => ({ ...idx, [table.name]: Math.max(0, (idx[table.name] || 0) - 1) }))}
                              disabled={!table.rows || (rowIndexes[table.name] || 0) <= 0}
                              aria-label="Previous row"
                            >
                              <ChevronUpIcon className="w-4 h-4" />
                            </button>
                            <span className="font-mono">{(rowIndexes[table.name] || 0) + 1}</span>
                            <button
                              className="p-1 rounded hover:bg-sand-200 disabled:opacity-50"
                              onClick={() => setRowIndexes(idx => ({ ...idx, [table.name]: Math.min((table.rows?.length || 1) - 1, (idx[table.name] || 0) + 1) }))}
                              disabled={!table.rows || (rowIndexes[table.name] || 0) >= (table.rows?.length || 1) - 1}
                              aria-label="Next row"
                            >
                              <ChevronDownIcon className="w-4 h-4" />
                            </button>
                            <span className="text-sand-500 text-xs">({table.rows?.length || 0} total)</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map((col: any) => (
                        <tr key={col.name} className="border-b border-sand">
                          <td className="p-2 font-mono w-[20%] truncate">{col.name}</td>
                          <td className="p-2 font-mono text-sand-700 w-[40%] truncate">{col.type}</td>
                          <td className="p-2 font-mono text-espresso w-[40%] truncate">
                            {table.rows && table.rows.length > 0
                              ? (table.rows[rowIndexes[table.name] || 0]?.[col.name] ?? '')
                              : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 
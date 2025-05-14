import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, pageUrl } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    // Find or create customer
    let customerRes = await pool.query('SELECT * FROM "Customer" WHERE email = $1', [email]);
    let customer;
    if (customerRes.rows.length > 0) {
      customer = customerRes.rows[0];
      // Only set name/phone if not already present
      const newName = (!customer.name || !customer.name.trim()) && name && name.trim() ? name : customer.name;
      const newPhone = (!customer.phone || !customer.phone.trim()) && phone && phone.trim() ? phone : customer.phone;
      await pool.query('UPDATE "Customer" SET name = $1, phone = $2 WHERE id = $3', [newName, newPhone, customer.id]);
    } else {
      const insertRes = await pool.query('INSERT INTO "Customer" (name, email, phone, created) VALUES ($1, $2, $3, NOW()) RETURNING *', [name, email, phone]);
      customer = insertRes.rows[0];
    }
    // Store name and phone in Message table as well
    await pool.query('INSERT INTO "Message" ("customerId", "content", "created", "updated", "productSlug", "pageUrl", "status", "name", "phone") VALUES ($1, $2, NOW(), NOW(), $3, $4, $5, $6, $7)', [customer.id, message, null, pageUrl || null, 'unread', name, phone]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 
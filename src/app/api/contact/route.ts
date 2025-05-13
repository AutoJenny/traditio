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
      if (customer.name !== name || customer.phone !== phone) {
        await pool.query('UPDATE "Customer" SET name = $1, phone = $2 WHERE id = $3', [name, phone, customer.id]);
      }
    } else {
      const insertRes = await pool.query('INSERT INTO "Customer" (name, email, phone, created) VALUES ($1, $2, $3, NOW()) RETURNING *', [name, email, phone]);
      customer = insertRes.rows[0];
    }
    // Create message
    await pool.query(
      'INSERT INTO "Message" ("customerId", content, "pageUrl", created, status, "productSlug") VALUES ($1, $2, $3, NOW(), $4, $5)',
      [customer.id, message, pageUrl || null, 'unread', null]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 
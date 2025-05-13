import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    // Upsert customer
    let customerRes = await pool.query('SELECT * FROM "Customer" WHERE email = $1', [email]);
    let customer;
    if (customerRes.rows.length > 0) {
      customer = customerRes.rows[0];
      await pool.query('UPDATE "Customer" SET name = $1, phone = $2 WHERE id = $3', [name || customer.name, phone || customer.phone, customer.id]);
    } else {
      const insertRes = await pool.query('INSERT INTO "Customer" (name, email, phone, "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *', [name, email, phone]);
      customer = insertRes.rows[0];
    }
    return NextResponse.json({ success: true, customerId: customer.id });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone } = await req.json();
    console.log('[NEWSLETTER] Incoming:', { email, name, phone });
    if (!email) {
      console.log('[NEWSLETTER] Missing email');
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    // Upsert customer
    let customerRes = await pool.query('SELECT * FROM "Customer" WHERE email = $1', [email]);
    console.log('[NEWSLETTER] Customer lookup:', customerRes.rows);
    let customer;
    if (customerRes.rows.length > 0) {
      customer = customerRes.rows[0];
      // Only set name/phone if not already present
      const newName = (!customer.name || !customer.name.trim()) && name && name.trim() ? name : customer.name;
      const newPhone = (!customer.phone || !customer.phone.trim()) && phone && phone.trim() ? phone : customer.phone;
      await pool.query('UPDATE "Customer" SET name = $1, phone = $2, newsletter = true WHERE id = $3', [newName, newPhone, customer.id]);
      console.log('[NEWSLETTER] Updated existing customer:', customer.id);
    } else {
      const insertRes = await pool.query('INSERT INTO "Customer" (name, email, phone, newsletter, created) VALUES ($1, $2, $3, true, NOW()) RETURNING *', [name, email, phone]);
      customer = insertRes.rows[0];
      console.log('[NEWSLETTER] Inserted new customer:', customer.id);
    }
    return NextResponse.json({ success: true, customerId: customer.id });
  } catch (error) {
    console.error('[NEWSLETTER] Signup error:', error);
    return NextResponse.json({ error: error.message || error.toString() }, { status: 500 });
  }
} 
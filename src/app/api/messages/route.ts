import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET() {
  try {
    const res = await pool.query(`
      SELECT m.*, c.name as customer_name, c.email as customer_email, m.status
      FROM "Message" m
      JOIN "Customer" c ON m."customerId" = c.id
      ORDER BY m.created DESC
    `);
    return NextResponse.json(res.rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 
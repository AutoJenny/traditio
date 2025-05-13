import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT m.id, m."customerId", m."content", m."pageUrl", m."created" as created, m."updated" as updated, m."productSlug", m."status", c.name as customer_name, c.email as customer_email
      FROM "Message" m
      JOIN "Customer" c ON m."customerId" = c.id
      ORDER BY m."created" DESC
    `);
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 
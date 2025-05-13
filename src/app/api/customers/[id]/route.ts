import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    const custRes = await pool.query('SELECT * FROM "Customer" WHERE id = $1', [id]);
    if (custRes.rows.length === 0) return NextResponse.json(null);
    const customer = custRes.rows[0];
    const msgRes = await pool.query('SELECT * FROM "Message" WHERE "customerId" = $1 ORDER BY created DESC', [id]);
    return NextResponse.json({ ...customer, messages: msgRes.rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    const res = await pool.query(`
      SELECT m.*, c.name as customer_name, c.email as customer_email
      FROM "Message" m
      JOIN "Customer" c ON m."customerId" = c.id
      WHERE m.id = $1
    `, [id]);
    if (res.rows.length === 0) return NextResponse.json(null);
    return NextResponse.json(res.rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    const { status } = await req.json();
    await pool.query('UPDATE "Message" SET status = $1 WHERE id = $2', [status, id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 
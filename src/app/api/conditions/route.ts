import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/traditio' });

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM "Condition" ORDER BY id');
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch conditions', details: err.message }, { status: 500 });
  }
} 
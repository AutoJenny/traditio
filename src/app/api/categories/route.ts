import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

function withCors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}

export async function GET() {
  const { rows: categories } = await pool.query('SELECT * FROM "Category" ORDER BY "order" ASC');
  const response = NextResponse.json(categories);
  return withCors(response);
} 
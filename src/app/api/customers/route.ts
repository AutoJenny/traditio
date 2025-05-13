import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET() {
  try {
    // Get all customers
    const custRes = await pool.query('SELECT * FROM "Customer" ORDER BY name, email');
    const customers = custRes.rows;
    // Get all messages
    const msgRes = await pool.query('SELECT * FROM "Message" ORDER BY "createdAt" DESC');
    const messages = msgRes.rows;
    // Attach messages to customers
    const customersWithMessages = customers.map(cust => ({
      ...cust,
      messages: messages.filter(msg => msg.customerId === cust.id)
    }));
    return NextResponse.json(customersWithMessages);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 
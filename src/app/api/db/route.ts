import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET() {
  try {
    // Get all table names in the public schema
    const tablesRes = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    const tables = tablesRes.rows.map(row => row.table_name);
    // For each table, get columns
    const tableDetails = [];
    for (const table of tables) {
      const columnsRes = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [table]);
      // Fetch all rows of data
      let rows = [];
      try {
        const dataRes = await pool.query(`SELECT * FROM "${table}"`);
        rows = dataRes.rows;
      } catch (e) {
        // Table may be empty or have permissions issues; ignore
        rows = [];
      }
      tableDetails.push({
        name: table,
        columns: columnsRes.rows.map(col => ({ name: col.column_name, type: col.data_type })),
        rows
      });
    }
    return NextResponse.json({ tables: tableDetails });
  } catch (error) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
} 
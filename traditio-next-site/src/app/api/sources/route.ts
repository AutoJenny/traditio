import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/sources?query=foo
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.toLowerCase() || '';
  const sources = await prisma.source.findMany({
    where: query
      ? { name: { contains: query, mode: 'insensitive' } }
      : {},
    orderBy: { name: 'asc' },
    take: 10,
  });
  return NextResponse.json(sources);
}

// POST /api/sources
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, address, postcode, notes } = body;
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const source = await prisma.source.create({
    data: { name, address, postcode, notes },
  });
  return NextResponse.json(source);
} 
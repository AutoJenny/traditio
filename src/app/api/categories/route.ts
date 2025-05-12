import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

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
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });
  const response = NextResponse.json(categories);
  return withCors(response);
} 
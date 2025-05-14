import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

// Slugify utility: converts a string to a URL-friendly slug with dashes only
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]+/g, '') // Remove non-word, non-space, non-dash
    .replace(/_/g, '-')         // Convert underscores to dashes
    .replace(/\s+/g, '-')      // Convert spaces to dashes
    .replace(/-+/g, '-')        // Collapse multiple dashes
    .replace(/^-+|-+$/g, '');   // Trim leading/trailing dashes
} 
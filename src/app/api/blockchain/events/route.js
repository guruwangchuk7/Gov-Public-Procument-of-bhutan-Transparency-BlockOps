import { NextResponse } from 'next/server';

/**
 * API Route to fetch recent blockchain events.
 * Currently returns a placeholder for future Supabase integration.
 */
export async function GET() {
  return NextResponse.json({
    events: [],
    message: 'Blockchain event indexing in progress'
  });
}

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('tenders')
      .select('*, agencies(agency_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Public Tenders API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

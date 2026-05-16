import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('tenders')
      .select('*, agencies(agency_name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

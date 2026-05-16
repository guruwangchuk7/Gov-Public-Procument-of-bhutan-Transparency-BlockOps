import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('awards')
      .select('*, tenders(title), suppliers(company_name), bids(bid_amount)')
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

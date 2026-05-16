import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get('supplierId');

  try {
    const { data, error } = await supabase
      .from('awards')
      .select('*, tenders(title, agencies(agency_name)), bids(bid_amount)')
      .eq('winning_supplier_id', supplierId)
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

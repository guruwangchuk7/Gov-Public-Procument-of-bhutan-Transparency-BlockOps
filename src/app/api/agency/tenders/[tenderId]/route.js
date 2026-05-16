import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const supabase = createClient();
  const { tenderId } = params;

  try {
    // Fetch Tender
    const { data: tender, error: tenderErr } = await supabase
      .from('tenders')
      .select('*, agencies(agency_name)')
      .eq('id', tenderId)
      .single();

    if (tenderErr) throw tenderErr;

    // Fetch Bids with Supplier info
    const { data: bids, error: bidsErr } = await supabase
      .from('bids')
      .select('*, suppliers(company_name, email)')
      .eq('tender_id', tenderId)
      .order('bid_amount', { ascending: true });

    if (bidsErr) throw bidsErr;

    return NextResponse.json({ tender, bids });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

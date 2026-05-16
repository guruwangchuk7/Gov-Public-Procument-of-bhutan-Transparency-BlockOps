import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const tenderId = searchParams.get('tenderId');

  try {
    // 1. Fetch Tender
    const { data: tender } = await supabase
      .from('tenders')
      .select('*, agencies(agency_name)')
      .eq('id', tenderId)
      .single();

    // 2. Fetch Events
    const { data: events } = await supabase
      .from('blockchain_events')
      .select('*')
      .eq('related_tender_id', tenderId)
      .order('created_at', { ascending: true });

    // 3. Fetch Specific Events for Hash Comparison
    const tender_event = events.find(e => e.event_name === 'TenderCreated');
    const award_event = events.find(e => e.event_name === 'WinnerSelected');

    // 4. Fetch Award
    const { data: award } = await supabase
      .from('awards')
      .select('*')
      .eq('tender_id', tenderId)
      .single();

    return NextResponse.json({
      tender,
      events,
      tender_event,
      award_event,
      award
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

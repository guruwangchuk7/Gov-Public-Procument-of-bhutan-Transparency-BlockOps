import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const bidId = searchParams.get('bidId');

  if (!bidId) {
    return NextResponse.json({ error: 'Missing bidId parameter' }, { status: 400 });
  }

  try {
    const { data: bid, error } = await supabase
      .from('bids')
      .select('*, tenders(*)')
      .eq('id', bidId)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error('Bid Status API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

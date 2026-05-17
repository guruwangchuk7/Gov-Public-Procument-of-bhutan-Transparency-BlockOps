import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const agencyId = searchParams.get('agencyId');

  if (!agencyId) {
    return NextResponse.json({ error: 'Missing agencyId' }, { status: 400 });
  }

  try {
    // 1. Get all tenders for the agency
    const { data: tenders, error: tendersError } = await supabase
      .from('tenders')
      .select('id, status, title, created_at')
      .eq('agency_id', agencyId);

    if (tendersError) throw tendersError;

    const tenderIds = tenders.map(t => t.id);

    // 2. Count Bids Received for all tenders belonging to this agency
    let totalBidsCount = 0;
    if (tenderIds.length > 0) {
      const { count, error: bidsError } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .in('tender_id', tenderIds);
      
      if (bidsError) throw bidsError;
      totalBidsCount = count || 0;
    }

    // 3. Count Stats
    const activeTendersCount = tenders.filter(t => t.status === 'published').length;
    const awardedTendersCount = tenders.filter(t => t.status === 'awarded').length;
    const awaitingPublishCount = tenders.filter(t => t.status === 'draft').length;

    // 4. Get Latest Tenders
    const { data: latestTenders, error: latestError } = await supabase
      .from('tenders')
      .select('*, bids(count)')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (latestError) throw latestError;

    const formattedTenders = latestTenders.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      bids: t.bids?.[0]?.count || 0,
      date: t.published_at || t.created_at
    }));

    return NextResponse.json({
      success: true,
      stats: {
        activeTenders: activeTendersCount,
        bidsReceived: totalBidsCount,
        awardedTenders: awardedTendersCount,
        awaitingPublish: awaitingPublishCount
      },
      latestTenders: formattedTenders
    });
  } catch (error) {
    console.error('Agency Dashboard Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

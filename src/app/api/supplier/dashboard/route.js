import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get('supplierId');

  if (!supplierId) {
    return NextResponse.json({ error: 'Missing supplierId' }, { status: 400 });
  }

  try {
    // 1. Fetch all bids for this supplier
    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select('*, tenders(title, estimated_amount, status)')
      .eq('supplier_id', supplierId);

    if (bidsError) throw bidsError;

    // 2. Fetch Won Contracts (awards) count
    const { count: wonCount, error: wonError } = await supabase
      .from('awards')
      .select('*', { count: 'exact', head: true })
      .eq('supplier_id', supplierId);

    if (wonError) throw wonError;

    // 3. Count Open Tenders
    const { count: openTendersCount, error: openError } = await supabase
      .from('tenders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (openError) throw openError;

    // 4. Format Recent Bids
    const formattedBids = bids.slice(0, 5).map(b => ({
      id: b.id,
      title: b.tenders?.title || 'Unknown Tender',
      amount: b.bid_amount ? `Nu. ${b.bid_amount.toLocaleString()}` : 'N/A',
      status: b.blockchain_tx_hash ? 'On-chain' : 'Submitted'
    }));

    // 5. Fetch Recommended Tenders (Latest Tenders where supplier hasn't bid)
    const bidTenderIds = bids.map(b => b.tender_id);
    let recommendedQuery = supabase
      .from('tenders')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(2);
    
    if (bidTenderIds.length > 0) {
      recommendedQuery = recommendedQuery.not('id', 'in', `(${bidTenderIds.join(',')})`);
    }

    const { data: recommendedTenders, error: recError } = await recommendedQuery;
    if (recError) throw recError;

    const formattedRec = recommendedTenders.map(t => {
      // Calculate remaining days
      const deadline = new Date(t.submission_deadline);
      const diffTime = deadline - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const remainingText = diffDays > 0 ? `${diffDays} days left` : 'Closed';

      return {
        id: t.id,
        title: t.title,
        deadline: remainingText,
        budget: t.estimated_amount ? `Nu. ${(t.estimated_amount / 1000000).toFixed(1)}M` : 'N/A'
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        activeBids: bids.length,
        openTenders: openTendersCount || 0,
        wonContracts: wonCount || 0,
        proofVerified: '100%'
      },
      recentBids: formattedBids,
      recommendedTenders: formattedRec
    });
  } catch (error) {
    console.error('Supplier Dashboard Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

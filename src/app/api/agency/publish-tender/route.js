import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const supabase = createClient();
  const { tenderId, txHash, publishedAt } = await request.json();

  try {
    // 1. Update tender status
    const { data: tender, error: updateError } = await supabase
      .from('tenders')
      .update({
        status: 'published',
        blockchain_tx_hash: txHash,
        published_at: publishedAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', tenderId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. Log blockchain event
    await supabase.from('blockchain_events').insert({
      event_name: 'TenderCreated',
      tx_hash: txHash,
      tx_status: 'confirmed',
      related_tender_id: tenderId,
      confirmed_at: publishedAt
    });

    // 3. Activity Log
    await supabase.from('activity_logs').insert({
      actor_type: 'Procuring_Agency',
      actor_id: tender.agency_id,
      action: 'Publish Tender',
      entity_type: 'tender',
      entity_id: tenderId,
      details: { title: tender.title, txHash }
    });

    return NextResponse.json({ success: true, tender });
  } catch (error) {
    console.error('Publish API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

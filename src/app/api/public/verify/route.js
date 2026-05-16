import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  try {
    // 1. Check if it's a Tender ID
    const { data: tender } = await supabase
      .from('tenders')
      .select('id, title, blockchain_tx_hash, published_at')
      .eq('id', q)
      .single();

    if (tender) {
      return NextResponse.json({
        verified: !!tender.blockchain_tx_hash,
        type: 'tender',
        id: tender.id,
        title: tender.title,
        txHash: tender.blockchain_tx_hash,
        timestamp: tender.published_at
      });
    }

    // 2. Check if it's a Document Hash
    const { data: doc } = await supabase
      .from('documents')
      .select('*, tenders(title), bids(*)')
      .eq('document_hash', q)
      .limit(1)
      .single();

    if (doc) {
      const txHash = doc.tenders?.blockchain_tx_hash || doc.bids?.blockchain_tx_hash;
      const timestamp = doc.tenders?.published_at || doc.bids?.submitted_at;
      
      return NextResponse.json({
        verified: !!txHash,
        type: doc.document_type,
        id: doc.id,
        title: doc.file_name,
        txHash: txHash,
        timestamp: timestamp
      });
    }

    return NextResponse.json({ verified: false });
  } catch (error) {
    return NextResponse.json({ verified: false, error: error.message });
  }
}

import { NextResponse } from 'next/server';
import { BidSubmitService } from '@/services/supplier/bid-submit.service';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request) {
  const supabase = createAdminClient();
  const formData = await request.formData();

  const tenderId = formData.get('tenderId');
  const bidAmount = formData.get('bidAmount');
  const proposalSummary = formData.get('proposalSummary');
  const bidHash = formData.get('bidHash');
  const txHash = formData.get('txHash');
  const supplierId = formData.get('supplierId');
  const file = formData.get('file');

  try {
    // 1. Storage Upload (Handled in API for easier file stream handling)
    const safeFileName = file.name.replace(/\s+/g, '_');
    const fileName = `bids/${tenderId}/${supplierId}/${safeFileName}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // 2. Call Service to handle DB and Audit
    const result = await BidSubmitService.submitBid(supplierId, {
      tender_id: tenderId,
      bid_amount: parseFloat(bidAmount),
      proposal_summary: proposalSummary,
      bid_hash: bidHash,
      blockchain_tx_hash: txHash
    }, {
      file_name: file.name,
      storage_url: publicUrl,
      document_hash: bidHash,
      hash_algorithm: 'SHA-256'
    });

    return NextResponse.json({ success: true, bid: result.bid });
  } catch (error) {
    console.error('Bid API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

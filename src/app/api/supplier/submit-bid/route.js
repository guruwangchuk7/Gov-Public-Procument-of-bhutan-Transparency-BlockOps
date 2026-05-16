import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const supabase = createClient();
  const formData = await request.formData();

  const tenderId = formData.get('tenderId');
  const bidAmount = formData.get('bidAmount');
  const proposalSummary = formData.get('proposalSummary');
  const bidHash = formData.get('bidHash');
  const txHash = formData.get('txHash');
  const supplierId = formData.get('supplierId');
  const file = formData.get('file');

  try {
    // 1. Check if bid already exists
    const { data: existing } = await supabase
      .from('bids')
      .select('id')
      .eq('tender_id', tenderId)
      .eq('supplier_id', supplierId)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'You have already submitted a bid for this tender.' }, { status: 400 });
    }

    // 2. Create Bid Record
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        tender_id: tenderId,
        supplier_id: supplierId,
        bid_amount: parseFloat(bidAmount),
        proposal_summary: proposalSummary,
        bid_hash: bidHash,
        blockchain_tx_hash: txHash,
        status: 'on_chain_confirmed',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (bidError) throw bidError;

    // 3. Upload Proposal
    const fileName = `bids/${bid.id}/proposal_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // 4. Record Document
    const { error: docError } = await supabase
      .from('documents')
      .insert({
        bid_id: bid.id,
        supplier_id: supplierId,
        document_type: 'bid_proposal',
        file_name: file.name,
        storage_url: publicUrl,
        document_hash: bidHash,
        hash_algorithm: 'SHA-256'
      });

    if (docError) throw docError;

    // 5. Send confirmation from Supplier account
    await sendEmail({
      to: formData.get('email') || 'supplier@test.com', // In real case, from session
      subject: 'Bid Submitted Successfully - BGPS',
      senderRole: 'SUPPLIER',
      message: `
        <h1>Bid Confirmation</h1>
        <p>Your bid for Tender #${tenderId} has been successfully recorded on the blockchain.</p>
        <p>Transaction Hash: <a href="https://sepolia.etherscan.io/tx/${txHash}">${txHash}</a></p>
      `
    });

    // 6. Log Blockchain Event
    await supabase.from('blockchain_events').insert({
      event_name: 'BidSubmitted',
      tx_hash: txHash,
      tx_status: 'confirmed',
      related_bid_id: bid.id,
      related_tender_id: tenderId,
      confirmed_at: new Date().toISOString()
    });

    // 6. Activity Log
    await supabase.from('activity_logs').insert({
      actor_type: 'Supplier_Bidder',
      actor_id: supplierId,
      action: 'Submit Bid',
      entity_type: 'bid',
      entity_id: bid.id,
      details: { tenderId, bidAmount, txHash }
    });

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error('Bid API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

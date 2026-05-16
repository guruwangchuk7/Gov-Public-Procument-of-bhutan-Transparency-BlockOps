import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp';

export async function POST(request) {
  const supabase = createClient();
  const { tenderId, bidId, supplierId, justification, justificationHash, txHash } = await request.json();

  try {
    // 1. Start a "transaction" via sequence of updates
    
    // Update Tender
    const { data: tender, error: tenderErr } = await supabase
      .from('tenders')
      .update({ status: 'awarded', updated_at: new Date().toISOString() })
      .eq('id', tenderId)
      .select('*, agencies(agency_name)')
      .single();
    if (tenderErr) throw tenderErr;

    // Update Winner Bid
    const { data: winnerBid, error: bidErr } = await supabase
      .from('bids')
      .update({ status: 'winner' })
      .eq('id', bidId)
      .select('*, suppliers(company_name, email)')
      .single();
    if (bidErr) throw bidErr;

    // Update Other Bids
    await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('tender_id', tenderId)
      .neq('id', bidId);

    // 2. Create Award Record
    const { data: award, error: awardErr } = await supabase
      .from('awards')
      .insert({
        tender_id: tenderId,
        winning_bid_id: bidId,
        winning_supplier_id: supplierId,
        awarded_by_agency_id: tender.agency_id,
        justification,
        justification_hash: justificationHash,
        blockchain_tx_hash: txHash,
        awarded_at: new Date().toISOString()
      })
      .select()
      .single();
    if (awardErr) throw awardErr;

    // 3. Log Blockchain Event
    await supabase.from('blockchain_events').insert({
      event_name: 'WinnerSelected',
      tx_hash: txHash,
      tx_status: 'confirmed',
      related_tender_id: tenderId,
      related_bid_id: bidId,
      related_award_id: award.id,
      confirmed_at: new Date().toISOString()
    });

    // 4. Send Email to Winner
    await sendEmail({
      to: winnerBid.suppliers.email,
      subject: 'Notification of Award - BGPS',
      senderRole: 'AGENCY',
      message: `
        <h1>Congratulations!</h1>
        <p>Dear ${winnerBid.suppliers.company_name},</p>
        <p>We are pleased to inform you that your bid for <strong>${tender.title}</strong> has been selected as the winner.</p>
        <p><strong>Awarded Amount:</strong> Nu. ${winnerBid.bid_amount.toLocaleString()}</p>
        <p><strong>Justification:</strong> ${justification}</p>
        <p>Blockchain Proof: <a href="https://sepolia.etherscan.io/tx/${txHash}">${txHash}</a></p>
        <p>Our team will contact you shortly regarding the contract signing.</p>
      `,
      metadata: { related_award_id: award.id, related_tender_id: tenderId, related_bid_id: bidId }
    });

    // 5. Activity Log
    await supabase.from('activity_logs').insert({
      actor_type: 'Procuring_Agency',
      actor_id: tender.agency_id,
      action: 'Select Winner',
      entity_type: 'award',
      entity_id: award.id,
      details: { tenderId, bidId, supplierId, txHash }
    });

    return NextResponse.json({ success: true, award });
  } catch (error) {
    console.error('Select Winner API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { TenderRepository } from '@/repositories/tender.repository';
import { BidRepository } from '@/repositories/bid.repository';
import { AwardRepository } from '@/repositories/award.repository';
import { DocumentRepository } from '@/repositories/document.repository';
import { ActivityLogRepository, BlockchainEventRepository } from '@/repositories/audit.repository';
import { sendEmail } from '@/lib/email/smtp';

export const WinnerSelectionService = {
  async selectWinner(tenderId, agencyId, bidId, justificationData) {
    // 1. Verify Ownership
    const tender = await TenderRepository.getById(tenderId);
    if (!tender || tender.agency_id !== agencyId) throw new Error('Unauthorized');

    // 2. Load Winning Bid
    const bid = await BidRepository.getById(bidId);
    if (!bid || bid.tender_id !== tenderId) throw new Error('Invalid bid');

    // 3. Create Award Record
    const award = await AwardRepository.create({
      tender_id: tenderId,
      bid_id: bidId,
      supplier_id: bid.supplier_id,
      awarded_amount: bid.bid_amount,
      justification: justificationData.text,
      justification_hash: justificationData.hash,
      blockchain_tx_hash: justificationData.txHash,
      wallet_confirmed: true,
      awarded_at: new Date().toISOString()
    });

    // 4. Update Tender Status
    await TenderRepository.update(tenderId, { status: 'awarded' });

    // 5. Update Bid Statuses
    await BidRepository.updateStatus(bidId, 'winner');
    // Mark others as rejected
    await BidRepository.rejectOthers(tenderId, bidId);

    // 6. Record Blockchain Event
    await BlockchainEventRepository.create({
      event_name: 'WinnerSelected',
      tx_status: 'confirmed',
      tx_hash: justificationData.txHash,
      related_tender_id: tenderId,
      payload_hash: justificationData.hash,
      confirmed_at: new Date().toISOString()
    });

    // 7. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Procuring_Agency',
      actor_id: agencyId,
      action: 'Agency selected winner',
      entity_type: 'award',
      entity_id: award.id,
      details: `Winner selected for tender "${tender.title}". TX: ${justificationData.txHash}`
    });

    // 8. Notify Winner
    const supplierRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/suppliers?id=eq.${bid.supplier_id}`, {
        headers: { 
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
    });
    const suppliers = await supplierRes.json();
    const winningSupplier = suppliers[0];

    if (winningSupplier) {
      await sendEmail({
        to: winningSupplier.email,
        subject: 'BGPS Contract Award Notification',
        message: `Congratulations! Your company has been selected as the winner for tender "${tender.title}". Award Details: Nu. ${bid.bid_amount.toLocaleString()}.`,
        senderRole: 'AGENCY'
      });
    }

    return award;
  }
};

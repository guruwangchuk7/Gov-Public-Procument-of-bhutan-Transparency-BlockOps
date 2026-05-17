import { BidRepository } from '@/repositories/bid.repository';
import { DocumentRepository, ActivityLogRepository, BlockchainEventRepository } from '@/repositories/audit.repository';

export const BidSubmitService = {
  async submitBid(supplierId, bidData, documentData) {
    // 1. Create Bid in DB
    const bid = await BidRepository.create({
      ...bidData,
      supplier_id: supplierId,
      status: 'on_chain_confirmed', // Assuming tx already confirmed on frontend
      wallet_confirmed: true
    });

    // 2. Associate Document
    const document = await DocumentRepository.create({
      ...documentData,
      entity_type: 'bid',
      entity_id: bid.id,
      document_type: 'bid_proposal',
      uploaded_at: new Date().toISOString()
    });

    // 3. Record Blockchain Event
    await BlockchainEventRepository.create({
      event_name: 'BidSubmitted',
      tx_status: 'confirmed',
      tx_hash: bidData.blockchain_tx_hash,
      related_tender_id: bidData.tender_id,
      payload_hash: bidData.bid_hash,
      confirmed_at: new Date().toISOString()
    });

    // 4. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Supplier_Bidder',
      actor_id: supplierId,
      action: 'Supplier submitted bid',
      entity_type: 'bid',
      entity_id: bid.id,
      details: `Bid submitted for tender ID: ${bidData.tender_id}. TX: ${bidData.blockchain_tx_hash}`
    });

    return { bid, document };
  }
};

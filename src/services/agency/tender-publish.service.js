import { TenderRepository } from '@/repositories/tender.repository';
import { BlockchainEventRepository, ActivityLogRepository } from '@/repositories/audit.repository';

export const TenderPublishService = {
  async publishTender(tenderId, agencyId, txHash) {
    // 1. Verify Tender Ownership and Status
    const tender = await TenderRepository.getById(tenderId);
    if (!tender || tender.agency_id !== agencyId) throw new Error('Unauthorized or tender not found');
    if (tender.status !== 'draft') throw new Error('Only draft tenders can be published');

    // 2. Update Tender Status
    const updatedTender = await TenderRepository.update(tenderId, {
      status: 'published',
      published_at: new Date().toISOString(),
      blockchain_tx_hash: txHash
    });

    // 3. Record Blockchain Event
    await BlockchainEventRepository.create({
      event_name: 'TenderCreated',
      tx_status: 'confirmed',
      tx_hash: txHash,
      related_tender_id: tenderId,
      payload_hash: tender.tender_hash,
      confirmed_at: new Date().toISOString()
    });

    // 4. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Procuring_Agency',
      actor_id: agencyId,
      action: 'Agency published tender',
      entity_type: 'tender',
      entity_id: tenderId,
      details: `Tender "${tender.title}" published to Ethereum Sepolia. TX: ${txHash}`
    });

    return updatedTender;
  }
};

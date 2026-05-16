import { TenderRepository } from '@/repositories/tender.repository';
import { DocumentRepository } from '@/repositories/document.repository';
import { ActivityLogRepository } from '@/repositories/audit.repository';

export const TenderCreateService = {
  async createTender(agencyId, tenderData, documentData) {
    // 1. Create Tender in Draft Status
    const tender = await TenderRepository.create({
      ...tenderData,
      agency_id: agencyId,
      status: 'draft',
      created_at: new Date().toISOString()
    });

    // 2. Associate Document
    const document = await DocumentRepository.create({
      ...documentData,
      entity_type: 'tender',
      entity_id: tender.id,
      document_type: 'tender_document',
      uploaded_at: new Date().toISOString()
    });

    // 3. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Procuring_Agency',
      actor_id: agencyId,
      action: 'Agency created tender',
      entity_type: 'tender',
      entity_id: tender.id,
      details: `Tender "${tender.title}" created in draft mode.`
    });

    return { tender, document };
  }
};

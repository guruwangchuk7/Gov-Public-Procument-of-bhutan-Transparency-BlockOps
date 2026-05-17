import { TenderRepository } from '@/repositories/tender.repository';
import { AwardRepository } from '@/repositories/award.repository';
import { BidRepository } from '@/repositories/bid.repository';
import { blockchainEventRepository } from '@/repositories/blockchain-event.repository';
import { PublicTenderViewRepository } from '@/repositories/public-tender-view.repository';
import { documentRepository } from '@/repositories/document.repository';

export const PublicTenderRecordService = {
  async getTenderRecord(tenderId) {
    try {
      // 1. Fetch Tender
      const tender = await TenderRepository.getById(tenderId);
      if (!tender) return { success: false, error: { code: 'NOT_FOUND', message: 'Tender not found' } };

      // 2. Fetch Award if any
      const award = await AwardRepository.getByTender(tenderId);

      // 3. Fetch Confirmed Events
      const { data: events } = await (createClient()
        .from('blockchain_events')
        .select('*')
        .eq('related_tender_id', tenderId)
        .eq('tx_status', 'confirmed')
        .order('confirmed_at', { ascending: true }));

      // 3.5 Fetch Audit Status
      const { data: auditReports } = await (createClient()
        .from('audit_reports')
        .select('status, created_at, auditors(full_name)')
        .eq('tender_id', tenderId)
        .eq('status', 'verified')); // Only show "Verified" status publicly

      // 4. Fetch Stats
      const viewCount = await PublicTenderViewRepository.getTenderStats(tenderId);

      // 5. Log View
      await PublicTenderViewRepository.recordView({ tender_id: tenderId });

      // 6. Fetch Documents
      const documents = await documentRepository.getDocumentsByEntity(tenderId, 'tender');

      // Clean tender for public display
      const publicTender = {
        id: tender.id,
        title: tender.title,
        description: tender.description,
        estimated_amount: tender.estimated_amount,
        submission_deadline: tender.submission_deadline,
        status: tender.status,
        published_at: tender.published_at,
        agency_name: tender.agencies?.agency_name,
        tender_hash: tender.tender_hash,
        blockchain_tx_hash: tender.blockchain_tx_hash,
        documents: documents || []
      };

      return {
        success: true,
        data: {
          tender: publicTender,
          award: award ? {
            awarded_at: award.awarded_at,
            blockchain_tx_hash: award.blockchain_tx_hash,
            supplier_name: award.suppliers?.company_name,
            amount: award.bids?.bid_amount,
            bid_hash: award.bids?.bid_hash // Publicly expose winning bid hash for verification
          } : null,
          events: events || [],
          audits: auditReports || [],
          stats: {
            views: viewCount + 1
          }
        }
      };
    } catch (error) {
      console.error('Tender Record Service Error:', error);
      return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
    }
  }
};

function createClient() {
  const { createClient: supabaseCreate } = require('@supabase/supabase-js');
  return supabaseCreate(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

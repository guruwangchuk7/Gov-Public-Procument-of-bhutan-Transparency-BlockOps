import { TenderRepository } from '@/repositories/tender.repository';
import { BidRepository } from '@/repositories/bid.repository';
import { AwardRepository } from '@/repositories/award.repository';
import { AgencyRepository, SupplierRepository } from '@/repositories/registration.repository';
import { blockchainEventRepository } from '@/repositories/blockchain-event.repository';
import { PublicTenderViewRepository } from '@/repositories/public-tender-view.repository';
import { verifyHash } from '@/lib/hash/document-hash';

export const PublicVerificationService = {
  /**
   * Performs deep blockchain vs database hash verification.
   * Supports Tender ID or specific TX Hash.
   */
  async verifyProof(query) {
    try {
      let result = {
        status: 'pending',
        database_hash: null,
        blockchain_hash: null,
        tx_hash: null,
        block_number: null,
        event_name: null,
        etherscan_url: null,
        verified: false
      };

      // 1. Try to find if query is a Tender ID
      let tender = await TenderRepository.getById(query);
      let event = null;
      let entityType = 'tender';
      let dbHash = null;

      if (tender) {
        dbHash = tender.tender_hash;
        event = await blockchainEventRepository.findEventByEntity(tender.id, 'tender', 'TenderCreated');
      } else {
        // 2. Try to find if query is an Award ID or other
        // (Simplified for MVP: we prioritize Tender IDs)
        // If not found, check if it's a TX Hash in blockchain_events
        const { data: events } = await (createClient().from('blockchain_events').select('*').eq('tx_hash', query).limit(1));
        if (events && events.length > 0) {
          event = events[0];
          // Resolve entity from event
          if (event.related_tender_id) {
            tender = await TenderRepository.getById(event.related_tender_id);
            dbHash = tender?.tender_hash;
          }
        }
      }

      if (!event) {
        return { success: true, data: { ...result, status: 'pending', message: 'No blockchain record found yet.' } };
      }

      result.tx_hash = event.tx_hash;
      result.block_number = event.block_number;
      result.event_name = event.event_name;
      result.blockchain_hash = event.payload_hash;
      result.database_hash = dbHash;
      result.etherscan_url = `https://sepolia.etherscan.io/tx/${event.tx_hash}`;

      if (event.tx_status === 'failed') {
        result.status = 'failed';
        result.message = 'Blockchain transaction failed.';
      } else if (event.tx_status === 'confirmed') {
        const matches = verifyHash(dbHash, event.payload_hash);
        result.status = matches ? 'trusted' : 'suspicious';
        result.verified = matches;
        result.message = matches ? 'Cryptographic proof verified.' : 'INTEGRITY BREACH: Database hash mismatch!';

        // Automated Dispute: Log public detection of mismatch
        if (!matches) {
          const { ActivityLogRepository } = require('@/repositories/audit.repository');
          await ActivityLogRepository.create({
            actor_type: 'Public_Citizen',
            action: 'PUBLIC_PROOF_SUSPICIOUS',
            entity_type: 'public_tender_view',
            entity_id: tender?.id || event.tx_hash,
            details: {
              tx_hash: event.tx_hash,
              db_hash: dbHash,
              chain_hash: event.payload_hash
            }
          });
        }
      }

      // Record tracking
      if (tender) {
        await PublicTenderViewRepository.updateVerification(tender.id, event.tx_hash);
      }

      return { success: true, data: result };

    } catch (error) {
      console.error('Verification Service Error:', error);
      return { success: false, error: { code: 'VERIFY_ERROR', message: error.message } };
    }
  }
};

// Helper for the API
function createClient() {
  const { createClient: supabaseCreate } = require('@supabase/supabase-js');
  return supabaseCreate(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

import { DocumentRepository } from '@/repositories/document.repository';
import { getBGPSContractReadOnly } from '@/lib/blockchain/contract';
import { ethers } from 'ethers';

/**
 * Service to verify the integrity of procurement documents.
 * Compares local database records against immutable blockchain hashes.
 */
export const DocumentVerificationService = {
  /**
   * Verifies a document's integrity by comparing its hash across three layers:
   * 1. The provided file's actual hash (Current State)
   * 2. The database stored hash (Expected State)
   * 3. The blockchain stored hash (Immutable Truth)
   * 
   * @param {string} documentId - The ID of the document to verify
   * @param {string} currentFileHash - The SHA-256 hash generated from the current version of the file
   */
  async verifyIntegrity(documentId, currentFileHash) {
    try {
      // 1. Fetch expected hash from Database
      const document = await DocumentRepository.findById(documentId);
      if (!document) throw new Error('Document record not found');

      const dbHash = document.document_hash;
      
      // 2. Fetch immutable hash from Blockchain
      // This is the core 'Anti-Tamper' check
      let blockchainHash = null;
      let isBlockchainVerified = false;

      // In real mode, we query the contract events or state
      if (process.env.NEXT_PUBLIC_BLOCKCHAIN_MODE === 'real') {
        const contract = await getBGPSContractReadOnly();
        
        // We look for the event related to this document type
        // For Tenders, we'd check the TenderCreated event mapping
        // (Simplified for MVP: assuming we store a mapping or can filter events)
        // Here we simulate the contract call
        blockchainHash = await contract.getTenderHash(document.tender_id); 
      } else {
        // Mock Mode: Return the DB hash to simulate a 'Clean' audit
        // unless we want to simulate a tamper event
        blockchainHash = dbHash; 
      }

      // 3. Perform Cross-Check
      const matchesDb = currentFileHash === dbHash;
      const matchesBlockchain = currentFileHash === blockchainHash;

      const isTampered = !matchesBlockchain;

      return {
        document_id: documentId,
        status: isTampered ? 'TAMPERED' : 'VERIFIED',
        details: {
          current_hash: currentFileHash,
          database_hash: dbHash,
          blockchain_hash: blockchainHash,
          integrity_verified: !isTampered,
          timestamp: new Date().toISOString()
        },
        alert: isTampered ? 'CRITICAL: DOCUMENT TAMPERING DETECTED! On-chain hash does not match current file.' : null
      };

    } catch (error) {
      console.error('Integrity Verification Failed:', error);
      return { status: 'ERROR', error: error.message };
    }
  }
};

import { AuditReportRepository } from '@/repositories/audit-report.repository';
import { ActivityLogRepository } from '@/repositories/audit.repository';
import { BidRepository } from '@/repositories/bid.repository';
import { compareHashes } from '@/lib/hash/hash-normalization';

export const AuditReportService = {
  /**
   * Compares hashes and saves an official audit report.
   * Implements "Soft Freeze" if hash mismatch is detected on a bid.
   */
  async submitReport({ auditorId, tenderId, bidId, documentId, dbHash, blockchainHash, blockchainEventId, notes }) {
    if (!dbHash || !blockchainHash || blockchainHash === 'PENDING') {
        throw new Error('Cannot audit record with missing cryptographic proof');
    }

    // 1. Determine Status via real comparison
    const isVerified = compareHashes(dbHash, blockchainHash);
    const status = isVerified ? 'verified' : 'suspicious';

    // 2. Persist Report
    const report = await AuditReportRepository.create({
      auditor_id: auditorId,
      tender_id: tenderId,
      bid_id: bidId,
      document_id: documentId,
      database_hash: dbHash,
      blockchain_hash: blockchainHash,
      blockchain_event_id: blockchainEventId,
      status: status,
      notes: notes
    });

    // 3. Log Activity with high-severity action if suspicious
    await ActivityLogRepository.create({
      actor_type: 'Auditor',
      actor_id: auditorId,
      action: isVerified ? 'AUDIT_VERIFIED' : 'SUSPICIOUS_HASH_DETECTED',
      entity_type: 'audit_report',
      entity_id: report.id,
      details: {
          tender_id: tenderId,
          bid_id: bidId,
          status: status,
          database_hash: dbHash,
          blockchain_hash: blockchainHash,
          notes: notes
      }
    });

    // 4. Automated Soft Freeze: Mark bid as under_review if hash mismatch
    if (!isVerified && bidId) {
      await BidRepository.updateStatus(bidId, 'under_review');
      
      // Log the status change
      await ActivityLogRepository.create({
        actor_type: 'System',
        actor_id: auditorId, // The auditor who triggered the detection
        action: 'BID_SOFT_FREEZE_UNDER_REVIEW',
        entity_type: 'bid',
        entity_id: bidId,
        details: `Bid marked as under_review due to integrity mismatch detected by auditor. Audit Report: ${report.id}`
      });
    }

    return report;
  }
};

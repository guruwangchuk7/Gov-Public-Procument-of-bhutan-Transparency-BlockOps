import { AgencyRepository, SupplierRepository } from '@/repositories/registration.repository';
import { ActivityLogRepository, BlockchainEventRepository } from '@/repositories/audit.repository';
import { documentRepository } from '@/repositories/document.repository';
import { sendEmail } from '@/lib/email/smtp';

export const AdminApprovalService = {
  /**
   * Approves an agency registration.
   * This step marks it as approved in DB and creates a pending blockchain event.
   */
  async approveAgency(agencyId, adminId) {
    const agency = await AgencyRepository.updateStatus(agencyId, {
      status: 'approved',
      verified_by_admin_id: adminId,
      verified_at: new Date().toISOString()
    });

    // Fetch registration hash
    const docs = await documentRepository.getDocumentsByEntity(agencyId, 'agency');
    const regDoc = docs.find(d => d.document_type === 'agency_registration');
    if (!regDoc || !regDoc.document_hash) {
      throw new Error('Registration document hash missing. Cannot authorize on-chain.');
    }

    const event = await BlockchainEventRepository.create({
      event_name: 'AgencyWalletAuthorized',
      tx_status: 'pending',
      related_agency_id: agencyId,
      payload_hash: regDoc.document_hash
    });

    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin approved agency',
      entity_type: 'agency',
      entity_id: agencyId,
      details: `Agency ${agency.agency_name} approved. Awaiting blockchain confirmation.`
    });

    return { agency, event };
  },

  /**
   * Rejects an agency registration.
   */
  async rejectAgency(agencyId, adminId, reason) {
    const agency = await AgencyRepository.updateStatus(agencyId, {
      status: 'rejected',
      rejection_reason: reason,
      verified_by_admin_id: adminId,
      verified_at: new Date().toISOString()
    });

    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin rejected agency',
      entity_type: 'agency',
      entity_id: agencyId,
      details: `Agency ${agency.agency_name} rejected. Reason: ${reason}`
    });

    await sendEmail({
      to: agency.email,
      subject: 'BGPS Agency Registration Update',
      message: `Your agency registration for "${agency.agency_name}" has been rejected. Reason: ${reason}`,
      senderRole: 'ADMIN'
    });

    return agency;
  },

  /**
   * Confirms the blockchain transaction for an agency.
   */
  async confirmAgencyBlockchain(agencyId, eventId, txHash, adminId) {
    if (!txHash) throw new Error('Transaction hash is required for confirmation');

    const agency = await AgencyRepository.updateStatus(agencyId, {
      blockchain_authorized: true,
      authorization_tx_hash: txHash
    });

    await BlockchainEventRepository.update(eventId, {
      tx_status: 'confirmed',
      tx_hash: txHash,
      confirmed_at: new Date().toISOString()
    });

    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Agency blockchain authorization confirmed',
      entity_type: 'agency',
      entity_id: agencyId,
      details: `Blockchain authorization confirmed. TX: ${txHash}`
    });

    await sendEmail({
      to: agency.email,
      subject: 'BGPS Agency Approved & Authorized',
      message: `Your agency "${agency.agency_name}" has been successfully approved and authorized on the BGPS Blockchain. You can now access your dashboard.`,
      senderRole: 'ADMIN'
    });

    return { success: true, txHash };
  },

  /**
   * Approves a supplier registration.
   */
  async approveSupplier(supplierId, adminId) {
    const supplier = await SupplierRepository.updateStatus(supplierId, {
      status: 'approved',
      verified_by_admin_id: adminId,
      verified_at: new Date().toISOString()
    });

    // Fetch registration hash
    const docs = await documentRepository.getDocumentsByEntity(supplierId, 'supplier');
    const regDoc = docs.find(d => d.document_type === 'supplier_registration');
    if (!regDoc || !regDoc.document_hash) {
      throw new Error('Registration document hash missing. Cannot authorize on-chain.');
    }

    const event = await BlockchainEventRepository.create({
      event_name: 'SupplierWalletAuthorized',
      tx_status: 'pending',
      related_supplier_id: supplierId,
      payload_hash: regDoc.document_hash
    });

    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin approved supplier',
      entity_type: 'supplier',
      entity_id: supplierId,
      details: `Supplier ${supplier.company_name} approved. Awaiting blockchain confirmation.`
    });

    return { supplier, event };
  },

  /**
   * Confirms the blockchain transaction for a supplier.
   */
  async confirmSupplierBlockchain(supplierId, eventId, txHash, adminId) {
    if (!txHash) throw new Error('Transaction hash is required for confirmation');

    const supplier = await SupplierRepository.updateStatus(supplierId, {
      blockchain_authorized: true,
      authorization_tx_hash: txHash
    });

    await BlockchainEventRepository.update(eventId, {
      tx_status: 'confirmed',
      tx_hash: txHash,
      confirmed_at: new Date().toISOString()
    });

    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Supplier blockchain authorization confirmed',
      entity_type: 'supplier',
      entity_id: supplierId,
      details: `Blockchain authorization confirmed. TX: ${txHash}`
    });

    await sendEmail({
      to: supplier.email,
      subject: 'BGPS Supplier Approved & Authorized',
      message: `Your company "${supplier.company_name}" has been successfully approved as a registered supplier on BGPS.`,
      senderRole: 'ADMIN'
    });

    return { success: true, txHash };
  },

  /**
   * Processes the entire approval and authorization flow in one go.
   * Used when the frontend has already confirmed the transaction.
   */
  async processFullAgencyApproval(agencyId, adminId, txHash) {
    // 1. Approve in DB
    const agency = await AgencyRepository.updateStatus(agencyId, {
      status: 'approved',
      verified_by_admin_id: adminId,
      verified_at: new Date().toISOString(),
      blockchain_authorized: true,
      authorization_tx_hash: txHash
    });

    // Fetch registration hash
    const docs = await documentRepository.getDocumentsByEntity(agencyId, 'agency');
    const regDoc = docs.find(d => d.document_type === 'agency_registration');
    if (!regDoc || !regDoc.document_hash) {
      throw new Error('Registration document hash missing. Cannot authorize on-chain.');
    }

    // 2. Record Blockchain Event
    await BlockchainEventRepository.create({
      event_name: 'AgencyWalletAuthorized',
      tx_status: 'confirmed',
      tx_hash: txHash,
      related_agency_id: agencyId,
      payload_hash: regDoc.document_hash,
      confirmed_at: new Date().toISOString()
    });

    // 3. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin approved and authorized agency',
      entity_type: 'agency',
      entity_id: agencyId,
      details: `Agency ${agency.agency_name} approved and blockchain authorized. TX: ${txHash}`
    });

    // 4. Notify
    await sendEmail({
      to: agency.email,
      subject: 'BGPS Agency Approved & Authorized',
      message: `Your agency "${agency.agency_name}" has been successfully approved and authorized on the BGPS Blockchain.`,
      senderRole: 'ADMIN'
    });

    return agency;
  },

  async processFullSupplierApproval(supplierId, adminId, txHash) {
    const supplier = await SupplierRepository.updateStatus(supplierId, {
      status: 'approved',
      verified_by_admin_id: adminId,
      verified_at: new Date().toISOString(),
      blockchain_authorized: true,
      authorization_tx_hash: txHash
    });

    // Fetch registration hash
    const docs = await documentRepository.getDocumentsByEntity(supplierId, 'supplier');
    const regDoc = docs.find(d => d.document_type === 'supplier_registration');
    if (!regDoc || !regDoc.document_hash) {
      throw new Error('Registration document hash missing. Cannot authorize on-chain.');
    }

    await BlockchainEventRepository.create({
      event_name: 'SupplierWalletAuthorized',
      tx_status: 'confirmed',
      tx_hash: txHash,
      related_supplier_id: supplierId,
      payload_hash: regDoc.document_hash,
      confirmed_at: new Date().toISOString()
    });

    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin approved and authorized supplier',
      entity_type: 'supplier',
      entity_id: supplierId,
      details: `Supplier ${supplier.company_name} approved and blockchain authorized. TX: ${txHash}`
    });

    await sendEmail({
      to: supplier.email,
      subject: 'BGPS Supplier Approved & Authorized',
      message: `Your company "${supplier.company_name}" has been successfully approved as a registered supplier on BGPS.`,
      senderRole: 'ADMIN'
    });

    return supplier;
  }
};

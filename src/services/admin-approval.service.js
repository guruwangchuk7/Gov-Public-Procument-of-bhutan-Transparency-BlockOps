import { AgencyRepository, SupplierRepository } from '@/repositories/registration.repository';
import { ActivityLogRepository, BlockchainEventRepository } from '@/repositories/audit.repository';
import { sendEmail } from '@/lib/email/smtp';

export const AdminApprovalService = {
  // --- AGENCY FLOW ---
  async approveAgency(agencyId, adminId) {
    const agency = await AgencyRepository.updateStatus(agencyId, {
      status: 'approved',
      verified_by_admin_id: adminId,
      verified_at: new Date().toISOString()
    });

    const event = await BlockchainEventRepository.create({
      event_name: 'AgencyWalletAuthorized',
      tx_status: 'pending',
      tx_hash: 'PENDING_TX_' + Math.random().toString(36).slice(2, 12),
      related_agency_id: agencyId,
      payload_hash: '0x' + Math.random().toString(16).slice(2, 66)
    });

    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin approved agency',
      entity_type: 'agency',
      entity_id: agencyId,
      details: `Agency ${agency.agency_name} approved. Blockchain authorization pending.`
    });

    return { agency, event };
  },

  async confirmAgencyBlockchain(agencyId, eventId, adminId) {
    const txHash = '0x' + Math.random().toString(16).slice(2, 66);
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
      action: 'Mock blockchain verification confirmed (Agency)',
      entity_type: 'agency',
      entity_id: agencyId,
      details: `Blockchain authorization confirmed for agency. TX: ${txHash}`
    });

    await sendEmail({
      to: agency.email,
      subject: 'BGPS Agency Approved & Authorized',
      message: `Your agency "${agency.agency_name}" has been successfully approved and authorized on the BGPS Blockchain. You can now access your dashboard.`,
      senderRole: 'ADMIN'
    });

    return { success: true, txHash };
  },

  // --- SUPPLIER FLOW ---
  async approveSupplier(supplierId, adminId) {
    const supplier = await SupplierRepository.updateStatus(supplierId, {
      status: 'approved',
      verified_by_admin_id: adminId,
      verified_at: new Date().toISOString()
    });

    const event = await BlockchainEventRepository.create({
      event_name: 'SupplierWalletAuthorized',
      tx_status: 'pending',
      tx_hash: 'PENDING_TX_' + Math.random().toString(36).slice(2, 12),
      related_supplier_id: supplierId,
      payload_hash: '0x' + Math.random().toString(16).slice(2, 66)
    });

    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin approved supplier',
      entity_type: 'supplier',
      entity_id: supplierId,
      details: `Supplier ${supplier.company_name} approved. Blockchain authorization pending.`
    });

    return { supplier, event };
  },

  async confirmSupplierBlockchain(supplierId, eventId, adminId) {
    const txHash = '0x' + Math.random().toString(16).slice(2, 66);
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
      action: 'Mock blockchain verification confirmed (Supplier)',
      entity_type: 'supplier',
      entity_id: supplierId,
      details: `Blockchain authorization confirmed for supplier. TX: ${txHash}`
    });

    await sendEmail({
      to: supplier.email,
      subject: 'BGPS Supplier Approved & Authorized',
      message: `Your company "${supplier.company_name}" has been successfully approved as a registered supplier on BGPS.`,
      senderRole: 'ADMIN'
    });

    return { success: true, txHash };
  }
};

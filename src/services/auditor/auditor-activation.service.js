import { AuditorInvitationRepository } from '@/repositories/auditor-invitation.repository';
import { AuditorRepository } from '@/repositories/auditor.repository';
import { ActivityLogRepository } from '@/repositories/audit.repository';

export const AuditorActivationService = {
  async activateAuditor(token, ndiProfile, walletAddress) {
    // 1. Validate Invitation
    const invitation = await AuditorInvitationRepository.getByToken(token);
    if (!invitation) throw new Error('Invalid invitation token');
    if (invitation.status !== 'pending') throw new Error('Invitation already used or expired');
    if (new Date(invitation.expires_at) < new Date()) throw new Error('Invitation expired');

    // 2. Create Auditor Profile
    const auditor = await AuditorRepository.create({
      full_name: ndiProfile.full_name,
      ndi_identifier: ndiProfile.ndi_identifier,
      wallet_address: walletAddress.toLowerCase(),
      email: invitation.email,
      is_active: true
    });

    // 3. Mark Invitation as Used
    await AuditorInvitationRepository.markUsed(invitation.id);

    // 4. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Auditor',
      actor_id: auditor.id,
      action: 'Auditor activated account',
      entity_type: 'auditor',
      entity_id: auditor.id,
      details: `Account activated for ${auditor.full_name} via NDI and Wallet.`
    });

    return auditor;
  }
};

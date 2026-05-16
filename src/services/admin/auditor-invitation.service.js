import { AuditorInvitationRepository } from '@/repositories/auditor-invitation.repository';
import { ActivityLogRepository } from '@/repositories/audit.repository';
import { sendEmail } from '@/lib/email/smtp';
import crypto from 'crypto';

export const AuditorInvitationService = {
  async inviteAuditor(adminId, auditorEmail, fullName) {
    // 1. Generate Token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // 2. Create Invitation
    const invitation = await AuditorInvitationRepository.create({
      email: auditorEmail,
      full_name: fullName,
      invitation_token: token,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    });

    // 3. Send Email
    const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auditor/activate?token=${token}`;
    await sendEmail({
      to: auditorEmail,
      subject: 'Invitation to BGPS Auditor Network',
      message: `
        <h1>Official Invitation</h1>
        <p>Dear ${fullName},</p>
        <p>You have been invited to join the Bhutan Government Procurement System (BGPS) as an Auditor.</p>
        <p>Please click the link below to activate your account using your Bhutan NDI and Rabby Wallet:</p>
        <a href="${activationLink}">${activationLink}</a>
        <p>This invitation expires on ${expiresAt.toLocaleDateString()}.</p>
      `,
      senderRole: 'ADMIN'
    });

    // 4. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin invited auditor',
      entity_type: 'auditor_invitation',
      entity_id: invitation.id,
      details: `Invitation sent to ${auditorEmail}`
    });

    return invitation;
  }
};

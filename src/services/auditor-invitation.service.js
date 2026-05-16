import { createClient } from '@supabase/supabase-js';
import { ActivityLogRepository } from '@/repositories/audit.repository';
import { sendEmail } from '@/lib/email/smtp';
import crypto from 'crypto';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const AuditorInvitationService = {
  async invite(auditorName, auditorEmail, adminId) {
    const supabase = getSupabaseAdmin();
    
    // 1. Generate Credentials
    const tempUsername = 'auditor_' + Math.random().toString(36).slice(2, 8);
    const tempPassword = Math.random().toString(36).slice(2, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    // 2. Create Invitation Record
    const { data: invitation, error } = await supabase
      .from('auditor_invitations')
      .insert({
        auditor_name: auditorName,
        auditor_email: auditorEmail,
        temporary_username: tempUsername,
        temporary_password_hash: tempPassword, // In real case, hash this
        invitation_token: token,
        status: 'pending',
        expires_at: expiresAt,
        created_by_admin_id: adminId
      })
      .select()
      .single();

    if (error) throw error;

    // 3. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin invited auditor',
      entity_type: 'auditor_invitation',
      entity_id: invitation.id,
      details: `Auditor invitation sent to ${auditorEmail}`
    });

    // 4. Send Email
    await sendEmail({
      to: auditorEmail,
      subject: 'BGPS Auditor Invitation',
      message: `You have been invited as an auditor for BGPS. 
      Temporary Link: http://localhost:3000/auditor/invitation/${token}
      Username: ${tempUsername}
      Password: ${tempPassword}`,
      senderRole: 'ADMIN'
    });

    return invitation;
  }
};

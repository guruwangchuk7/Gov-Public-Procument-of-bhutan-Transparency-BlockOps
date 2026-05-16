import { createClient } from '@supabase/supabase-js';
import { ActivityLogRepository } from '@/repositories/audit.repository';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const AuditorActivationService = {
  async activate(token, username, password, ndiData, walletAddress) {
    const supabase = getSupabaseAdmin();

    // 1. Verify Invitation
    const { data: invitation, error: invError } = await supabase
      .from('auditor_invitations')
      .select('*')
      .eq('invitation_token', token)
      .eq('temporary_username', username)
      .eq('temporary_password_hash', password)
      .eq('status', 'pending')
      .single();

    if (invError || !invitation) throw new Error('Invalid or expired invitation');

    // 2. Create Auditor Account
    const { data: auditor, error: audError } = await supabase
      .from('auditors')
      .insert({
        invitation_id: invitation.id,
        full_name: invitation.auditor_name,
        email: invitation.auditor_email,
        ndi_identifier: ndiData.ndi_identifier,
        wallet_address: walletAddress,
        is_active: true,
        activated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (audError) throw audError;

    // 3. Mark Invitation as Used
    await supabase
      .from('auditor_invitations')
      .update({ status: 'used', used_at: new Date().toISOString() })
      .eq('id', invitation.id);

    // 4. Log Activity
    await ActivityLogRepository.create({
      actor_type: 'Auditor',
      actor_id: auditor.id,
      action: 'Auditor activated account',
      entity_type: 'auditor',
      entity_id: auditor.id,
      details: `Auditor ${auditor.full_name} activated account via NDI and Wallet.`
    });

    return auditor;
  }
};

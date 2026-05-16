import { createClient } from '@/lib/supabase/server';

export const AuditorInvitationRepository = {
  async create(invitationData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('auditor_invitations')
      .insert(invitationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getByToken(token) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('auditor_invitations')
      .select('*')
      .eq('invitation_token', token)
      .single();

    if (error) return null;
    return data;
  },

  async markUsed(id) {
    const supabase = createClient();
    const { error } = await supabase
      .from('auditor_invitations')
      .update({ status: 'used', used_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
};

import { createClient } from '@/lib/supabase/server';

export const agencyRepository = {
  /**
   * Fetches all agency registrations with optional filtering.
   */
  async getAllAgencies() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Updates an agency status and verification details.
   */
  async updateAgencyStatus(agencyId, { status, adminId, rejectionReason, blockchainAuthorized, txHash }) {
    const supabase = createClient();
    const updateData = {
      status,
      verified_by_admin_id: adminId,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (rejectionReason) updateData.rejection_reason = rejectionReason;
    if (blockchainAuthorized !== undefined) updateData.blockchain_authorized = blockchainAuthorized;
    if (txHash) updateData.authorization_tx_hash = txHash;

    const { data, error } = await supabase
      .from('agencies')
      .update(updateData)
      .eq('id', agencyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetches a single agency by ID.
   */
  async getAgencyById(id) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};

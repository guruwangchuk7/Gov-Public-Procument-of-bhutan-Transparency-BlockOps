import { createClient } from '@/lib/supabase/server';

export const tenderRepository = {
  /**
   * Creates a new tender in draft status.
   */
  async createTender(tenderData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tenders')
      .insert({
        ...tenderData,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates tender status and blockchain details.
   */
  async updateTenderStatus(tenderId, { status, txHash, publishedAt, closedAt }) {
    const supabase = createClient();
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    if (txHash) updateData.blockchain_tx_hash = txHash;
    if (publishedAt) updateData.published_at = publishedAt;
    if (closedAt) updateData.closed_at = closedAt;

    const { data, error } = await supabase
      .from('tenders')
      .update(updateData)
      .eq('id', tenderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetches tenders for a specific agency.
   */
  async getAgencyTenders(agencyId) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tenders')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Fetches all published tenders for suppliers/public.
   */
  async getPublishedTenders() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tenders')
      .select('*, agencies(agency_name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

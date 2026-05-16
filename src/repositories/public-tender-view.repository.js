import { createClient } from '@/lib/supabase/server';

export const PublicTenderViewRepository = {
  /**
   * Records a new public view of a tender.
   */
  async recordView(viewData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('public_tender_views')
      .insert({
        ...viewData,
        viewed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates a view record when verification is clicked.
   */
  async updateVerification(tenderId, txHash) {
    const supabase = createClient();
    // We update the most recent view for this tender or just add a new record
    // The ERD suggests a record for each view/click
    const { data, error } = await supabase
      .from('public_tender_views')
      .insert({
        tender_id: tenderId,
        verification_clicked: true,
        blockchain_tx_hash: txHash,
        viewed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Gets stats for public trust display.
   */
  async getTenderStats(tenderId) {
    const supabase = createClient();
    const { count, error } = await supabase
      .from('public_tender_views')
      .select('*', { count: 'exact', head: true })
      .eq('tender_id', tenderId);
    
    if (error) return 0;
    return count;
  }
};

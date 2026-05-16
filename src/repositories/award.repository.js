import { createClient } from '@/lib/supabase/server';

export const AwardRepository = {
  async create(awardData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('awards')
      .insert({
        ...awardData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getByTender(tenderId) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('awards')
      .select('*, suppliers(company_name), bids(*)')
      .eq('tender_id', tenderId)
      .single();

    if (error) return null;
    return data;
  },

  async getWinningResults() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('awards')
      .select(`
        id,
        awarded_at,
        blockchain_tx_hash,
        tenders (id, title, status, agencies (agency_name)),
        suppliers (company_name),
        bids (bid_amount)
      `)
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

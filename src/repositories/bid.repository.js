import { createClient } from '@/lib/supabase/server';

export const BidRepository = {
  async create(bidData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bids')
      .insert({
        ...bidData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bids')
      .select('*, suppliers(company_name)')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async getByTender(tenderId) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bids')
      .select('*, suppliers(company_name)')
      .eq('tender_id', tenderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bids')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async rejectOthers(tenderId, winningBidId) {
    const supabase = createClient();
    const { error } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('tender_id', tenderId)
      .neq('id', winningBidId);

    if (error) throw error;
  }
};

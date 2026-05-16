import { createClient } from '@/lib/supabase/server';

export const AgencyRepository = {
  async getAllAgencies() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAgencyById(id) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async findByIdentifier(ndi_identifier) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('ndi_identifier', ndi_identifier)
      .single();
    
    if (error) return null;
    return data;
  },

  async findByWallet(wallet_address) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('wallet_address', wallet_address.toLowerCase())
      .single();
    
    if (error) return null;
    return data;
  },

  async updateStatus(agencyId, updateData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agencies')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', agencyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

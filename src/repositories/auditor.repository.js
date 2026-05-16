import { createClient } from '@/lib/supabase/server';

export const AuditorRepository = {
  async findByIdentifier(ndi_identifier) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .eq('ndi_identifier', ndi_identifier)
      .single();
    
    if (error) return null;
    return data;
  },

  async findByWallet(wallet_address) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .eq('wallet_address', wallet_address.toLowerCase())
      .single();
    
    if (error) return null;
    return data;
  },

  async create(auditorData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('auditors')
      .insert({
        ...auditorData,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getVerifiedAuditors() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('auditors')
      .select('full_name, activated_at')
      .eq('is_active', true)
      .order('activated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

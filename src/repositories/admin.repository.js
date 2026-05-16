import { createClient } from '@/lib/supabase/server';

export const AdminRepository = {
  async findByIdentifier(ndi_identifier) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('ndi_identifier', ndi_identifier)
      .single();
    
    if (error) return null;
    return data;
  },

  async findByWallet(wallet_address) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .ilike('wallet_address', wallet_address)
      .single();
    
    if (error) return null;
    return data;
  }
};

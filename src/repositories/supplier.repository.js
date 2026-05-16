import { createClient } from '@/lib/supabase/server';

export const SupplierRepository = {
  async getAllSuppliers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getSupplierById(id) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async findByIdentifier(ndi_identifier) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('ndi_identifier', ndi_identifier)
      .single();
    
    if (error) return null;
    return data;
  },

  async findByWallet(wallet_address) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .ilike('wallet_address', wallet_address)
      .single();
    
    if (error) return null;
    return data;
  },

  async updateStatus(supplierId, updateData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suppliers')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', supplierId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const AgencyRepository = {
  async create(agencyData) {
    const { data, error } = await getSupabaseAdmin()
      .from('agencies')
      .insert(agencyData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAllPending() {
    const { data, error } = await getSupabaseAdmin()
      .from('agencies')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateStatus(id, updateData) {
    const { data, error } = await getSupabaseAdmin()
      .from('agencies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const SupplierRepository = {
  async create(supplierData) {
    const { data, error } = await getSupabaseAdmin()
      .from('suppliers')
      .insert(supplierData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAllPending() {
    const { data, error } = await getSupabaseAdmin()
      .from('suppliers')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateStatus(id, updateData) {
    const { data, error } = await getSupabaseAdmin()
      .from('suppliers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

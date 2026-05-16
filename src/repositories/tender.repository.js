import { createClient } from '@/lib/supabase/server';

export const TenderRepository = {
  async create(tenderData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tenders')
      .insert({
        ...tenderData,
        status: tenderData.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updateData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tenders')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tenders')
      .select('*, agencies(agency_name)')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

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

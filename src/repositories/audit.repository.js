import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const DocumentRepository = {
  async create(docData) {
    const { data, error } = await getSupabaseAdmin()
      .from('documents')
      .insert(docData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const ActivityLogRepository = {
  async create(logData) {
    const { data, error } = await getSupabaseAdmin()
      .from('activity_logs')
      .insert(logData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const BlockchainEventRepository = {
  async create(eventData) {
    const { data, error } = await getSupabaseAdmin()
      .from('blockchain_events')
      .insert(eventData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async update(id, updateData) {
    const { data, error } = await getSupabaseAdmin()
      .from('blockchain_events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

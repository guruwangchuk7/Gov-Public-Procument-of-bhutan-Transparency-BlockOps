import { createClient } from '@/lib/supabase/server';

export const documentRepository = {
  /**
   * Records a new document in the database.
   */
  async createDocument(docData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .insert({
        ...docData,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetches documents related to an entity.
   */
  async getDocumentsByEntity(entityId, entityType) {
    const supabase = createClient();
    const query = supabase.from('documents').select('*');
    
    if (entityType === 'agency') query.eq('agency_id', entityId);
    if (entityType === 'supplier') query.eq('supplier_id', entityId);
    if (entityType === 'tender') query.eq('tender_id', entityId);
    if (entityType === 'bid') query.eq('bid_id', entityId);
    if (entityType === 'award') query.eq('award_id', entityId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
};

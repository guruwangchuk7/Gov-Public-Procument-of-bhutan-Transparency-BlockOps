import { createClient } from '@/lib/supabase/server';

export const AuditReportRepository = {
  /**
   * Creates a new audit report.
   */
  async create(reportData) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('audit_reports')
      .insert({
        ...reportData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetches an audit report for a specific tender/bid.
   */
  async getByTender(tenderId) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('audit_reports')
      .select('*, auditors(full_name)')
      .eq('tender_id', tenderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

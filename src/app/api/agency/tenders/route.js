import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const agencyId = searchParams.get('agencyId');

  try {
    const query = supabase
      .from('tenders')
      .select('*, documents(*)')
      .order('created_at', { ascending: false });

    if (agencyId) {
      query.eq('agency_id', agencyId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = createClient();
  const formData = await request.formData();

  const title = formData.get('title');
  const description = formData.get('description');
  const estimatedAmount = formData.get('estimatedAmount');
  const submissionDeadline = formData.get('submissionDeadline');
  const tenderHash = formData.get('tenderHash');
  const agencyId = formData.get('agencyId');
  const file = formData.get('file');

  try {
    // 1. Create Tender (draft)
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .insert({
        agency_id: agencyId,
        title,
        description,
        estimated_amount: parseFloat(estimatedAmount),
        submission_deadline: submissionDeadline,
        tender_hash: tenderHash,
        status: 'draft'
      })
      .select()
      .single();

    if (tenderError) throw tenderError;

    // 2. Upload Document
    const fileName = `tenders/${tender.id}/tender_spec_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // 3. Record Document
    const { error: docError } = await supabase
      .from('documents')
      .insert({
        tender_id: tender.id,
        agency_id: agencyId,
        document_type: 'tender_document',
        file_name: file.name,
        storage_url: publicUrl,
        document_hash: tenderHash,
        hash_algorithm: 'SHA-256'
      });

    if (docError) throw docError;

    // 4. Activity Log
    await supabase.from('activity_logs').insert({
      actor_type: 'Procuring_Agency',
      actor_id: agencyId,
      action: 'Create Tender Draft',
      entity_type: 'tender',
      entity_id: tender.id,
      details: { title }
    });

    return NextResponse.json({ success: true, tender });
  } catch (error) {
    console.error('Tender API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

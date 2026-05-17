import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();
  const formData = await request.formData();

  const id = formData.get('id');
  const title = formData.get('title');
  const description = formData.get('description');
  const estimatedAmount = formData.get('estimatedAmount');
  const submissionDeadline = formData.get('submissionDeadline');
  const tenderHash = formData.get('tenderHash');
  const agencyId = formData.get('agencyId');
  const file = formData.get('file');
  const status = formData.get('status') || 'draft';
  const txHash = formData.get('txHash');

  try {
    // 1. Create Tender
    const tenderData = {
      agency_id: agencyId,
      title,
      description,
      estimated_amount: parseFloat(estimatedAmount),
      submission_deadline: submissionDeadline,
      tender_hash: tenderHash,
      status: status,
      blockchain_tx_hash: txHash || null,
      published_at: status === 'published' ? new Date().toISOString() : null
    };

    if (id) {
      tenderData.id = id;
    }

    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .insert(tenderData)
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

    // 3.5 Record Blockchain Event if published directly
    if (status === 'published' && txHash) {
      await supabase.from('blockchain_events').insert({
        event_name: 'TenderCreated',
        tx_status: 'confirmed',
        tx_hash: txHash,
        related_tender_id: tender.id,
        payload_hash: tenderHash,
        confirmed_at: new Date().toISOString()
      });
    }

    // 4. Activity Log
    await supabase.from('activity_logs').insert({
      actor_type: 'Procuring_Agency',
      actor_id: agencyId,
      action: status === 'published' ? 'Agency published tender' : 'Create Tender Draft',
      entity_type: 'tender',
      entity_id: tender.id,
      details: { title, txHash }
    });

    return NextResponse.json({ success: true, tender });
  } catch (error) {
    console.error('Tender API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

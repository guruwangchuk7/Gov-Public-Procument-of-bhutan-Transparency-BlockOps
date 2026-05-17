import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  const supabase = createAdminClient();

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const path = formData.get('path') || 'general';
    const documentType = formData.get('documentType') || 'general_document';
    
    const agencyId = formData.get('agencyId') || null;
    const supplierId = formData.get('supplierId') || null;
    const tenderId = formData.get('tenderId') || null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Calculate Cryptographic Hash
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const docHash = `sha256-${hash}`;

    // 2. Upload to Supabase Storage
    const fileName = `${path}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        duplex: 'half'
      });

    if (uploadError) throw uploadError;

    // 3. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // 4. Record Document in Database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        tender_id: tenderId,
        agency_id: agencyId,
        supplier_id: supplierId,
        document_type: documentType,
        file_name: file.name,
        storage_url: publicUrl,
        document_hash: docHash,
        hash_algorithm: 'SHA-256'
      })
      .select()
      .single();

    if (docError) throw docError;

    return NextResponse.json({ 
      success: true, 
      document 
    });
  } catch (error) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

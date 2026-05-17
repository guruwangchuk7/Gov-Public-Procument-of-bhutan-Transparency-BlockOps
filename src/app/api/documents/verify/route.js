import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  const supabase = createClient();

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Calculate Hash
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const docHash = `sha256-${hash}`;

    // 2. Query Database for Document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*, tenders(*), agencies(*), suppliers(*)')
      .eq('document_hash', docHash)
      .maybeSingle();

    if (docError) throw docError;

    if (!document) {
      return NextResponse.json({ 
        success: true, 
        verified: false, 
        message: 'No matching document found in the database.' 
      });
    }

    // 3. Query Blockchain Events for recorded hash
    const { data: blockchainEvent, error: eventError } = await supabase
      .from('blockchain_events')
      .select('*')
      .eq('payload_hash', docHash)
      .maybeSingle();

    if (eventError) throw eventError;

    return NextResponse.json({
      success: true,
      verified: true,
      document,
      blockchainEvent,
      message: blockchainEvent 
        ? 'Document verified both in database and on the Ethereum Sepolia blockchain.'
        : 'Document verified in database, but blockchain proof is pending.'
    });
  } catch (error) {
    console.error('File Verification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

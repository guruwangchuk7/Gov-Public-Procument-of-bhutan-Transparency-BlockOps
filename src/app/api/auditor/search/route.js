import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type');

  try {
    let results = [];

    if (type === 'tender') {
      const { data } = await supabase
        .from('tenders')
        .select('id, title, status')
        .or(`id.eq.${q},title.ilike.%${q}%`)
        .limit(10);
      results = data.map(d => ({ ...d, type: 'tender' }));
    } else if (type === 'hash') {
      const { data } = await supabase
        .from('documents')
        .select('tender_id, tender:tenders(id, title, status)')
        .eq('document_hash', q)
        .limit(1);
      results = data.map(d => ({ ...d.tender, type: 'tender' }));
    } else if (type === 'tx') {
      const { data } = await supabase
        .from('blockchain_events')
        .select('related_tender_id, tender:tenders(id, title, status)')
        .eq('tx_hash', q)
        .limit(1);
      results = data.map(d => ({ ...d.tender, type: 'tender' }));
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

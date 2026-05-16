import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const supabase = createClient();
  const { tenderId } = await request.json();

  try {
    const { data, error } = await supabase
      .from('tenders')
      .update({
        status: 'closed',
        closed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', tenderId)
      .select()
      .single();

    if (error) throw error;

    // Activity Log
    await supabase.from('activity_logs').insert({
      actor_type: 'Procuring_Agency',
      actor_id: data.agency_id,
      action: 'Close Tender',
      entity_type: 'tender',
      entity_id: tenderId,
      details: { status: 'closed' }
    });

    return NextResponse.json({ success: true, tender: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

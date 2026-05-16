import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  try {
    // 1. Get stats
    const { count: verifiedTx } = await supabase
      .from('blockchain_events')
      .select('*', { count: 'exact', head: true })
      .eq('tx_status', 'confirmed');

    const { count: pendingAudits } = await supabase
      .from('audit_reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 2. Get recent events
    const { data: events } = await supabase
      .from('blockchain_events')
      .select('*, tenders(title)')
      .order('confirmed_at', { ascending: false })
      .limit(5);

    // 3. Get health (just a placeholder for MVP, but real query)
    const { data: logs } = await supabase.from('activity_logs').select('id').limit(1);

    return NextResponse.json({
      stats: {
        verifiedTx: verifiedTx || 0,
        pendingAudits: pendingAudits || 0,
        blockchainHeight: '11155111', // Sepolia Chain ID as placeholder
        systemHealth: logs ? '99.9%' : 'OFFLINE'
      },
      events: events || []
    });
  } catch (error) {
    console.error('Auditor Dashboard API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get('supplierId');

  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*, tenders(title)')
      .eq('supplier_id', supplierId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

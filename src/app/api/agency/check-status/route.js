import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const ndi = searchParams.get('ndi');
  const wallet = searchParams.get('wallet');

  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('status')
      .or(`ndi_identifier.eq.${ndi},wallet_address.eq.${wallet}`)
      .single();

    if (error || !data) return NextResponse.json({ status: 'not_found' });
    return NextResponse.json({ status: data.status });
  } catch (error) {
    return NextResponse.json({ status: 'error' });
  }
}

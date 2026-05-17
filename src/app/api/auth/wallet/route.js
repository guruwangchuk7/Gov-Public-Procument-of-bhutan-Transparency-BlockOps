import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const supabase = createClient();
  const { walletAddress } = await request.json();

  if (!walletAddress) {
    return NextResponse.json({ error: 'Missing walletAddress' }, { status: 400 });
  }

  try {
    const cleanWallet = walletAddress.toLowerCase();

    // Search Admin
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .ilike('wallet_address', cleanWallet)
      .maybeSingle();

    if (admin) return NextResponse.json({ success: true, role: 'Admin', record: admin });

    // Search Agency
    const { data: agency } = await supabase
      .from('agencies')
      .select('*')
      .ilike('wallet_address', cleanWallet)
      .maybeSingle();

    if (agency) return NextResponse.json({ success: true, role: 'Procuring_Agency', record: agency });

    // Search Supplier
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('*')
      .ilike('wallet_address', cleanWallet)
      .maybeSingle();

    if (supplier) return NextResponse.json({ success: true, role: 'Supplier_Bidder', record: supplier });

    // Search Auditor
    const { data: auditor } = await supabase
      .from('auditors')
      .select('*')
      .ilike('wallet_address', cleanWallet)
      .maybeSingle();

    if (auditor) return NextResponse.json({ success: true, role: 'System_Auditor', record: auditor });

    return NextResponse.json({ success: true, role: null, record: null, message: 'Wallet address not registered.' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

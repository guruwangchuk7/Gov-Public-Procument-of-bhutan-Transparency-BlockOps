import { NextResponse } from 'next/server';
import { AdminRepository } from '@/repositories/admin.repository';
import { AgencyRepository } from '@/repositories/agency.repository';
import { SupplierRepository } from '@/repositories/supplier.repository';
import { AuditorRepository } from '@/repositories/auditor.repository';
import { WalletLinking } from '@/lib/wallet/wallet-linking';

export async function POST(request) {
  try {
    const { selected_role, ndi_identifier, wallet_address } = await request.json();

    if (!selected_role) {
      return NextResponse.json({ error: 'Missing selected_role' }, { status: 400 });
    }

    // Public Citizen doesn't need a database record check for basic access
    if (selected_role === 'Public_Citizen') {
      return NextResponse.json({ success: true, allowed: true });
    }

    if (!ndi_identifier && !wallet_address) {
      return NextResponse.json({ error: 'Missing identity identifiers' }, { status: 400 });
    }

    let record = null;
    let repository = null;
    let roleName = '';

    switch (selected_role) {
      case 'Admin': repository = AdminRepository; roleName = 'admin'; break;
      case 'Procuring_Agency': repository = AgencyRepository; roleName = 'agency'; break;
      case 'Supplier_Bidder': repository = SupplierRepository; roleName = 'supplier'; break;
      case 'Auditor': repository = AuditorRepository; roleName = 'auditor'; break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // 1. Try finding by NDI identifier first
    if (ndi_identifier) {
      record = await repository.findByIdentifier(ndi_identifier);
    }

    // 2. Fallback: Try finding by Wallet address if NDI lookup failed
    if (!record && wallet_address) {
      record = await repository.findByWallet(wallet_address);
    }

    // 3. Final validation: If record exists, verify the wallet matches
    if (record) {
      const dbWallet = record.wallet_address || record.blockchain_address;
      if (!WalletLinking.isSameWallet(dbWallet, wallet_address)) {
        return NextResponse.json({ 
          success: false, 
          error: `Connected Rabby wallet does not match this ${roleName} account.` 
        }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      record: record || null
    });

  } catch (error) {
    console.error('Resolve Access Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

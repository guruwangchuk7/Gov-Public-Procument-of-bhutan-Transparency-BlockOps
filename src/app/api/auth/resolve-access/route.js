import { NextResponse } from 'next/server';
import { AdminRepository } from '@/repositories/admin.repository';
import { AgencyRepository } from '@/repositories/agency.repository';
import { SupplierRepository } from '@/repositories/supplier.repository';
import { AuditorRepository } from '@/repositories/auditor.repository';

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
    const normalized_wallet = wallet_address.toLowerCase();

    switch (selected_role) {
      case 'Admin':
        const admin = await AdminRepository.findByIdentifier(ndi_identifier);
        if (admin) {
          if (admin.wallet_address.toLowerCase() === normalized_wallet) {
            record = admin;
          } else {
            return NextResponse.json({ 
              success: false, 
              error: 'Connected Rabby wallet does not match this admin account.' 
            }, { status: 403 });
          }
        }
        break;
      case 'Procuring_Agency':
        const agency = await AgencyRepository.findByIdentifier(ndi_identifier);
        // If agency exists, it MUST match the wallet
        if (agency) {
          if (agency.wallet_address.toLowerCase() === normalized_wallet) {
            record = agency;
          } else {
            // Wallet mismatch for known NDI identity
            return NextResponse.json({ 
              success: false, 
              error: 'Connected Rabby wallet does not match this agency account.' 
            }, { status: 403 });
          }
        }
        break;
      case 'Supplier_Bidder':
        const supplier = await SupplierRepository.findByIdentifier(ndi_identifier);
        if (supplier) {
          if (supplier.wallet_address.toLowerCase() === normalized_wallet) {
            record = supplier;
          } else {
            return NextResponse.json({ 
              success: false, 
              error: 'Connected Rabby wallet does not match this supplier account.' 
            }, { status: 403 });
          }
        }
        break;
      case 'Auditor':
        const auditor = await AuditorRepository.findByIdentifier(ndi_identifier);
        if (auditor) {
          if (auditor.wallet_address.toLowerCase() === normalized_wallet) {
            record = auditor;
          } else {
            return NextResponse.json({ 
              success: false, 
              error: 'Connected Rabby wallet does not match this auditor account.' 
            }, { status: 403 });
          }
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
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

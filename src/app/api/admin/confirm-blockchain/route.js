import { NextResponse } from 'next/server';
import { AdminApprovalService } from '@/services/admin-approval.service';

export async function POST(request) {
  try {
    const { agencyId, supplierId, eventId, txHash, adminId } = await request.json();
    
    if (!eventId || !txHash) {
      return NextResponse.json({ error: 'Missing eventId or txHash' }, { status: 400 });
    }

    let result;
    if (agencyId) {
      result = await AdminApprovalService.confirmAgencyBlockchain(agencyId, eventId, txHash, adminId);
    } else if (supplierId) {
      result = await AdminApprovalService.confirmSupplierBlockchain(supplierId, eventId, txHash, adminId);
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

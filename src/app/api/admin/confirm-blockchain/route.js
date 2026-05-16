import { NextResponse } from 'next/server';
import { AdminApprovalService } from '@/services/admin-approval.service';

export async function POST(request) {
  try {
    const { agencyId, supplierId, eventId, adminId } = await request.json();
    
    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
    }

    let result;
    if (agencyId) {
      result = await AdminApprovalService.confirmAgencyBlockchain(agencyId, eventId, adminId || 'fb241743-f427-46ba-8fa5-8905bc20f2ec');
    } else if (supplierId) {
      result = await AdminApprovalService.confirmSupplierBlockchain(supplierId, eventId, adminId || 'fb241743-f427-46ba-8fa5-8905bc20f2ec');
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

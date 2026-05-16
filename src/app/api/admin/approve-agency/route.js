import { NextResponse } from 'next/server';
import { AdminApprovalService } from '@/services/admin-approval.service';

export async function POST(request) {
  try {
    const { agencyId, adminId, txHash } = await request.json();
    
    let result;
    if (txHash) {
      result = await AdminApprovalService.processFullAgencyApproval(agencyId, adminId, txHash);
    } else {
      result = await AdminApprovalService.approveAgency(agencyId, adminId);
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

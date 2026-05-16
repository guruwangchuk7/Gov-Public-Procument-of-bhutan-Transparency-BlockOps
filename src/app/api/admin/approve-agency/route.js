import { NextResponse } from 'next/server';
import { AdminApprovalService } from '@/services/admin-approval.service';

export async function POST(request) {
  try {
    const { agencyId, adminId } = await request.json();
    
    if (!agencyId) {
      return NextResponse.json({ error: 'Missing agencyId' }, { status: 400 });
    }

    const result = await AdminApprovalService.approveAgency(agencyId, adminId || 'admin-demo-1');
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

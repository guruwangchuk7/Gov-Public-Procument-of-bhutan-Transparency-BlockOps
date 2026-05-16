import { NextResponse } from 'next/server';
import { AdminApprovalService } from '@/services/admin-approval.service';

export async function POST(request) {
  try {
    const { supplierId, adminId } = await request.json();
    if (!supplierId) return NextResponse.json({ error: 'Missing supplierId' }, { status: 400 });

    const result = await AdminApprovalService.approveSupplier(supplierId, adminId || 'fb241743-f427-46ba-8fa5-8905bc20f2ec');
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

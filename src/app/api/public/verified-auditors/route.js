import { VerifiedAuditorsService } from '@/services/public/verified-auditors.service';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await VerifiedAuditorsService.getVerifiedAuditors();
  if (result.success) {
    return NextResponse.json(result);
  }
  return NextResponse.json(result, { status: 500 });
}

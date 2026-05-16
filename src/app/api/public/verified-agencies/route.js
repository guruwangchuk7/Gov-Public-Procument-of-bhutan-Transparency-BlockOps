import { VerifiedAgenciesService } from '@/services/public/verified-agencies.service';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await VerifiedAgenciesService.getVerifiedAgencies();
  if (result.success) {
    return NextResponse.json(result);
  }
  return NextResponse.json(result, { status: 500 });
}

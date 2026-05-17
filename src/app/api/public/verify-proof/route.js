import { PublicVerificationService } from '@/services/public/public-verification.service';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || searchParams.get('hash') || searchParams.get('id');

  if (!q) {
    return NextResponse.json({ success: false, error: 'Query parameter q, hash, or id is required' }, { status: 400 });
  }

  const result = await PublicVerificationService.verifyProof(q);
  if (result.success) {
    return NextResponse.json(result.data);
  }
  return NextResponse.json({ verified: false, error: result.error }, { status: 500 });
}

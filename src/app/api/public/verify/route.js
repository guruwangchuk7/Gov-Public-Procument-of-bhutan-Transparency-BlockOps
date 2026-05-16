import { PublicVerificationService } from '@/services/public/public-verification.service';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ success: false, error: { message: 'Query parameter q is required' } }, { status: 400 });
  }

  const result = await PublicVerificationService.verifyProof(q);
  
  // Adapt to existing UI expectations if needed, but the UI will be updated
  if (result.success) {
    return NextResponse.json(result.data);
  }
  
  return NextResponse.json({ verified: false, error: result.error }, { status: 500 });
}

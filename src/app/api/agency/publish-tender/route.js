import { NextResponse } from 'next/server';
import { TenderPublishService } from '@/services/agency/tender-publish.service';

export async function POST(request) {
  try {
    const { tenderId, agencyId, txHash } = await request.json();

    if (!tenderId || !txHash) {
      return NextResponse.json({ error: 'Missing tenderId or txHash' }, { status: 400 });
    }

    // In a real MVP, agencyId would be extracted from the session (e.g., via cookies/JWT)
    // For now, we take it from the payload if provided, or assume it's validated by the service.
    const tender = await TenderPublishService.publishTender(tenderId, agencyId, txHash);
    
    return NextResponse.json({ success: true, tender });
  } catch (error) {
    console.error('Publish API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

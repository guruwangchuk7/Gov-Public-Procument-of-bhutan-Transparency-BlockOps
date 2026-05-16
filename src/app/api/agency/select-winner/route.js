import { NextResponse } from 'next/server';
import { WinnerSelectionService } from '@/services/agency/winner-selection.service';

export async function POST(request) {
  try {
    const { tenderId, agencyId, bidId, justification, justificationHash, txHash } = await request.json();

    if (!tenderId || !bidId || !txHash) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const award = await WinnerSelectionService.selectWinner(tenderId, agencyId, bidId, {
      text: justification,
      hash: justificationHash,
      txHash: txHash
    });

    return NextResponse.json({ success: true, award });
  } catch (error) {
    console.error('Select Winner API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

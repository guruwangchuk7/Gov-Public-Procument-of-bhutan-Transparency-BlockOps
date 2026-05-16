import { WinningBidResultsService } from '@/services/public/winning-bid-results.service';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await WinningBidResultsService.getWinningResults();
  if (result.success) {
    return NextResponse.json(result);
  }
  return NextResponse.json(result, { status: 500 });
}

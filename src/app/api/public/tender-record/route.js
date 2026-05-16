import { PublicTenderRecordService } from '@/services/public/public-tender-record.service';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tenderId = searchParams.get('tenderId');

  if (!tenderId) {
    return NextResponse.json({ success: false, error: { message: 'tenderId is required' } }, { status: 400 });
  }

  const result = await PublicTenderRecordService.getTenderRecord(tenderId);
  if (result.success) {
    return NextResponse.json(result);
  }
  return NextResponse.json(result, { status: 500 });
}

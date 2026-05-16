import { NextResponse } from 'next/server';
import { NdiClient } from '@/lib/ndi/ndi-client';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get('threadId');

  if (!threadId) {
    return NextResponse.json({ error: 'Missing threadId' }, { status: 400 });
  }

  try {
    const result = await NdiClient.getProofStatus(threadId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

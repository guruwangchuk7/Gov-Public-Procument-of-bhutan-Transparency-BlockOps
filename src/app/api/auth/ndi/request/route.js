import { NextResponse } from 'next/server';
import { NdiClient } from '@/lib/ndi/ndi-client';

export async function GET() {
  try {
    const result = await NdiClient.createProofRequest();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

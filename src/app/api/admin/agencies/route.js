import { NextResponse } from 'next/server';
import { AgencyRepository } from '@/repositories/registration.repository';

export async function GET() {
  try {
    const agencies = await AgencyRepository.getAllPending();
    return NextResponse.json({ success: true, data: agencies });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { SupplierRepository } from '@/repositories/registration.repository';

export async function GET() {
  try {
    const suppliers = await SupplierRepository.getAllPending();
    return NextResponse.json({ success: true, data: suppliers });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

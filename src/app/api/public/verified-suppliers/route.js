import { VerifiedSuppliersService } from '@/services/public/verified-suppliers.service';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await VerifiedSuppliersService.getVerifiedSuppliers();
  if (result.success) {
    return NextResponse.json(result);
  }
  return NextResponse.json(result, { status: 500 });
}

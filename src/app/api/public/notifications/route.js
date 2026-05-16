import { PublicNotificationService } from '@/services/public/public-notification.service';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await PublicNotificationService.getNotifications();
  if (result.success) {
    return NextResponse.json(result);
  }
  return NextResponse.json(result, { status: 500 });
}

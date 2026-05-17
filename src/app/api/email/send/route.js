import { sendEmail } from '@/lib/email/smtp';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { to, subject, message, senderRole, metadata } = await request.json();
    
    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required email fields (to, subject, message)' }, { status: 400 });
    }

    const result = await sendEmail({ to, subject, message, senderRole, metadata });
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

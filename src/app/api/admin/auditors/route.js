import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp';

export async function POST(request) {
  const supabase = createClient();
  const { name, email } = await request.json();

  try {
    // 1. Create Auditor record
    const { data: auditor, error: auditorErr } = await supabase
      .from('auditors')
      .insert({
        full_name: name,
        email: email,
        is_active: false // Waiting for activation
      })
      .select()
      .single();

    if (auditorErr) throw auditorErr;

    // 2. Send Invitation Email
    const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auditor/activate?id=${auditor.id}`;
    
    await sendEmail({
      to: email,
      subject: 'Auditor Invitation - BGPS',
      senderRole: 'ADMIN',
      message: `
        <h1>Invitation to Audit</h1>
        <p>Dear ${name},</p>
        <p>You have been invited to serve as an independent auditor on the Blockchain-Based Government Procurement System (BGPS).</p>
        <p>Please click the link below to activate your account and verify your cryptographic identity:</p>
        <p><a href="${activationLink}">${activationLink}</a></p>
      `,
      metadata: { related_auditor_id: auditor.id }
    });

    // 3. Activity Log
    await supabase.from('activity_logs').insert({
      actor_type: 'System_Admin',
      action: 'Invite Auditor',
      entity_type: 'auditor',
      entity_id: auditor.id,
      details: { name, email }
    });

    return NextResponse.json({ success: true, auditor });
  } catch (error) {
    console.error('Invite Auditor Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

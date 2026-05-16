import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp';

export async function POST(request) {
  const supabase = createClient();
  const { agencyId, adminId, reason } = await request.json();

  try {
    const { data: agency, error: updateError } = await supabase
      .from('agencies')
      .update({
        status: 'rejected',
        verified_by_admin_id: adminId,
        verified_at: new Date().toISOString(),
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', agencyId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Send rejection email
    await sendEmail({
      to: agency.email,
      subject: 'Agency Registration Update - BGPS',
      message: `
        <h1>Registration Update</h1>
        <p>Dear ${agency.agency_name},</p>
        <p>We regret to inform you that your registration for the BGPS platform has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please review the reason and submit a new registration with the correct documents.</p>
      `,
      metadata: { related_agency_id: agencyId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

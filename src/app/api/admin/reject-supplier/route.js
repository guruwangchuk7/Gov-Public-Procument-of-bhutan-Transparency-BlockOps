import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp';

export async function POST(request) {
  const supabase = createClient();
  const { supplierId, adminId, reason } = await request.json();

  try {
    const { data: supplier, error: updateError } = await supabase
      .from('suppliers')
      .update({
        status: 'rejected',
        verified_by_admin_id: adminId,
        verified_at: new Date().toISOString(),
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', supplierId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log Activity
    await supabase.from('activity_logs').insert({
      actor_type: 'Admin',
      actor_id: adminId,
      action: 'Admin rejected supplier',
      entity_type: 'supplier',
      entity_id: supplierId,
      details: `Supplier ${supplier.company_name} rejected. Reason: ${reason}`
    });

    // Send rejection email
    await sendEmail({
      to: supplier.email,
      subject: 'Supplier Registration Update - BGPS',
      message: `
        <h1>Registration Update</h1>
        <p>Dear ${supplier.company_name},</p>
        <p>We regret to inform you that your registration for the BGPS platform has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please review the reason and submit a new registration with the correct documents.</p>
      `,
      metadata: { related_supplier_id: supplierId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

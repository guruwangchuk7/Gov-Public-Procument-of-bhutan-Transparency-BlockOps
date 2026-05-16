import { NextResponse } from 'next/server';
import { AuditorInvitationService } from '@/services/auditor-invitation.service';

export async function POST(request) {
  try {
    const { name, email, adminId } = await request.json();
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const invitation = await AuditorInvitationService.invite(
      name, 
      email, 
      adminId || 'fb241743-f427-46ba-8fa5-8905bc20f2ec'
    );

    return NextResponse.json({ success: true, data: invitation });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

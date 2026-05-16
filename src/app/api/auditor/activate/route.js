import { NextResponse } from 'next/server';
import { AuditorActivationService } from '@/services/auditor-activation.service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, username, password, ndiData, walletAddress } = body;
    
    if (!token || !username || !password || !ndiData || !walletAddress) {
      return NextResponse.json({ error: 'Missing activation data' }, { status: 400 });
    }

    const auditor = await AuditorActivationService.activate(
      token, 
      username, 
      password, 
      ndiData, 
      walletAddress
    );

    return NextResponse.json({ success: true, data: auditor });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

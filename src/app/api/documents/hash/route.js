import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Calculate SHA-256 Hash
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    return NextResponse.json({ 
      success: true, 
      hash: `sha256-${hash}`,
      fileName: file.name,
      fileSize: file.size
    });
  } catch (error) {
    console.error('File Hashing Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

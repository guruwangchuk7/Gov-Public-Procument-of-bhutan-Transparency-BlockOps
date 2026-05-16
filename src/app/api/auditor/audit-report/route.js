import { NextResponse } from 'next/server';
import { AuditReportService } from '@/services/auditor/audit-report.service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { auditorId, tenderId, bidId, documentId, dbHash, blockchainHash, blockchainEventId, notes } = body;

    if (!auditorId || !tenderId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const report = await AuditReportService.submitReport({
      auditorId,
      tenderId,
      bidId,
      documentId,
      dbHash,
      blockchainHash,
      blockchainEventId,
      notes
    });

    return NextResponse.json({
      success: true,
      data: report,
      message: "Audit report saved successfully"
    });
  } catch (error) {
    console.error('Audit Report API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: { message: error.message } 
    }, { status: 500 });
  }
}

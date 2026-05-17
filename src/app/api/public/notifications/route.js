import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  
  try {
    const notifications = [];

    // 1. Fetch Verified Agencies
    const { data: agencies } = await supabase
      .from('agencies')
      .select('*')
      .eq('status', 'approved')
      .order('verified_at', { ascending: false })
      .limit(5);

    if (agencies) {
      agencies.forEach(agency => {
        notifications.push({
          id: `agency-${agency.id}`,
          action: 'Agency Registered & Verified',
          details: { agencyName: agency.agency_name, title: 'Authorized procurement wallet synchronized' },
          created_at: agency.verified_at || agency.created_at
        });
      });
    }

    // 2. Fetch Verified Suppliers
    const { data: suppliers } = await supabase
      .from('suppliers')
      .select('*')
      .eq('status', 'approved')
      .order('verified_at', { ascending: false })
      .limit(5);

    if (suppliers) {
      suppliers.forEach(supplier => {
        notifications.push({
          id: `supplier-${supplier.id}`,
          action: 'Supplier Registered & Verified',
          details: { agencyName: supplier.company_name, title: 'Authorized supplier wallet synchronized' },
          created_at: supplier.verified_at || supplier.created_at
        });
      });
    }

    // 3. Fetch Blockchain Events (Tenders, Bids, Awards)
    const { data: events } = await supabase
      .from('blockchain_events')
      .select('*, tenders(title)')
      .eq('tx_status', 'confirmed')
      .order('confirmed_at', { ascending: false })
      .limit(10);

    if (events) {
      events.forEach(event => {
        if (event.event_name === 'TenderCreated') {
          notifications.push({
            id: `event-${event.id}`,
            action: 'Tender Published on Chain',
            details: { title: event.tenders?.title || `Tender ID: ${event.related_tender_id.slice(0, 8)}`, agencyName: 'Smart contract verified' },
            created_at: event.confirmed_at
          });
        } else if (event.event_name === 'BidSubmitted') {
          notifications.push({
            id: `event-${event.id}`,
            action: 'Bid Submitted on Chain',
            details: { title: `Secure encrypted bid hash submitted`, agencyName: `Tender Ref: ${event.related_tender_id.slice(0, 8)}` },
            created_at: event.confirmed_at
          });
        } else if (event.event_name === 'WinnerSelected') {
          notifications.push({
            id: `event-${event.id}`,
            action: 'Procurement Award Verified',
            details: { title: `Winning supplier awarded`, agencyName: `Tender Ref: ${event.related_tender_id.slice(0, 8)}` },
            created_at: event.confirmed_at
          });
        }
      });
    }

    // Sort notifications by created_at descending
    notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json(notifications.slice(0, 15));
  } catch (error) {
    console.error('Error constructing activity feed:', error);
    return NextResponse.json([], { status: 200 });
  }
}

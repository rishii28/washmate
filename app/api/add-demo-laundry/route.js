import { NextResponse } from 'next/server'

export async function GET() {
  // This API just returns the demo data - client will save to localStorage
  const DEMO_RECORDS = [
    { id: Date.now(), date: '2026-06-01', pairs: 5, singles: 1, status: 'Received', amount: 110, pickupStatus: null, pickupDate: null, serviceType: 'Clothes' },
    { id: Date.now() + 1, date: '2026-06-02', pairs: 10, singles: 0, status: 'Ready', amount: 200, pickupStatus: null, pickupDate: null, serviceType: 'Clothes' },
    { id: Date.now() + 2, date: '2026-06-03', pairs: 2, singles: 0, status: 'Completed', amount: 100, pickupStatus: 'Picked Up', pickupDate: '2026-06-03', serviceType: 'Blanket' }
  ]
  
  return NextResponse.json({ records: DEMO_RECORDS })
}
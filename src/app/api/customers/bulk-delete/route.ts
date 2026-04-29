import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/services/customer.service';

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();
    await CustomerService.bulkDelete(ids);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Bulk Delete Customers Error:', err);
    return NextResponse.json({ error: 'Failed to bulk delete customers' }, { status: 500 });
  }
}

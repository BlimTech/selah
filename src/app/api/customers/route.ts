import { NextResponse } from 'next/server';
import { CustomerService } from '@/services/customer.service';

export async function GET() {
  try {
    const data = await CustomerService.list();
    return NextResponse.json(data);
  } catch (err) {
    console.error('API Get Customers Error:', err);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

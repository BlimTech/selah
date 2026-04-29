import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/order.service';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { quantity, unit_price } = await req.json();
    await OrderService.confirm(id, quantity, unit_price);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Confirm Order Error:', err);
    return NextResponse.json({ error: 'Failed to confirm order' }, { status: 500 });
  }
}

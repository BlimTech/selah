import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/order.service';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status } = await req.json();
    await OrderService.updateStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Update Order Status Error:', err);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

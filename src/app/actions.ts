'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export async function confirmOrder(orderId: string, quantity: number) {
  // Use the MVP dummy price logic defined in backend
  const DUMMY_UNIT_PRICE = 1;
  const totalPrice = quantity * DUMMY_UNIT_PRICE;

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'unpaid',
      unit_price: DUMMY_UNIT_PRICE,
      total_price: totalPrice
    })
    .eq('id', orderId);

  if (error) {
    console.error('Failed to confirm order:', error);
    throw new Error('Failed to confirm order');
  }

  revalidatePath('/');
}

export async function updateOrderStatus(orderId: string, currentStatus: string) {
  const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Failed to update order status:', error);
    throw new Error('Failed to update order status');
  }

  revalidatePath('/');
  revalidatePath('/orders');
  revalidatePath('/debts');
  revalidatePath('/customers');
}

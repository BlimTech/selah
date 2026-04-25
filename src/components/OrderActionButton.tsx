'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions';
import { useDashboard } from '@/components/DashboardContext';

interface OrderActionButtonProps {
  orderId: string;
  currentStatus: string;
  quantity: number;
}

export default function OrderActionButton({ orderId, currentStatus, quantity }: OrderActionButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const { refresh, defaultPrice, openModal } = useDashboard();
  
  const isDraft = currentStatus === 'draft';
  const isPaid = currentStatus === 'paid';
  
  let label = 'Mark Paid';
  if (isDraft) label = 'Confirm Order';
  if (isPaid) label = 'Mark Unpaid';
  
  const style = {
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: isPending ? 'not-allowed' : 'pointer',
    border: 'none',
    backgroundColor: isDraft ? '#3B82F6' : (isPaid ? '#F59E0B' : '#22C55E'), // Blue for draft, Yellow for Paid->Unpaid, Green for Unpaid->Paid
    color: '#0B0B0B',
    fontWeight: 'bold' as const,
    opacity: isPending ? 0.7 : 1,
    transition: 'opacity 0.2s ease',
  };

  const handleAction = async () => {
    if (isDraft) {
      // For drafts, open the confirmation modal with pre-filled price/qty
      openModal('confirm_order', orderId, undefined, { qty: quantity, price: defaultPrice });
      return;
    }

    setIsPending(true);
    try {
      await updateOrderStatus(orderId, currentStatus);
      await refresh(); // Instant global update
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button style={style} onClick={handleAction} disabled={isPending}>
      {isPending ? 'Updating...' : label}
    </button>
  );
}

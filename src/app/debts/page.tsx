'use client';

import { useState } from 'react';
import { useDashboard } from '@/components/DashboardContext';
import EditableCustomerName from '@/components/EditableCustomerName';
import TableToolbar from '@/components/TableToolbar';

export default function Debts() {
  const { debts, loading } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading && debts.length === 0) return <div style={{ padding: '2rem' }}>Loading Debts...</div>;

  const filteredDebts = debts.filter(debt => {
    const query = searchQuery.toLowerCase();
    return (debt.name || '').toLowerCase().includes(query) || (debt.phone || '').includes(query);
  });

  return (
    <div>
      <h1 className="page-title">Active Debts</h1>

      <TableToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by customer..."
      />

      {/* DESKTOP VIEW */}
      <div style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderRadius: '8px', 
        border: '1px solid var(--color-border)', 
        maxHeight: '60vh',
        overflowY: 'auto'
      }} className="custom-scrollbar desktop-only">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#111', zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>Customer</th>
              <th style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>Orders</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>Total Debt</th>
            </tr>
          </thead>
          <tbody>
            {filteredDebts.map((debt: any) => (
              <tr key={debt.id} className="table-row">
                <td style={{ padding: '1rem 1.5rem' }}>
                  <EditableCustomerName id={debt.id} name={debt.name} phone={debt.phone} />
                </td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ color: 'var(--color-text)', fontWeight: '500' }}>{debt.unpaid_orders_count}</span>
                  <span style={{ color: 'var(--color-text-secondary)', marginLeft: '4px' }}>active orders</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--color-warning)', fontWeight: 'bold' }}>
                  ₦{Number(debt.total_debt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="mobile-only">
        {filteredDebts.map((debt: any) => (
          <div key={debt.id} className="mobile-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{debt.name || 'New Customer'}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{debt.phone}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{debt.unpaid_orders_count} unpaid orders</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Debt</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-warning)' }}>
                ₦{Number(debt.total_debt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {filteredDebts.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No active debts.</div>
        )}
      </div>

      <style jsx>{`
        .table-row { border-bottom: 1px solid var(--color-border); transition: background-color 0.2s; }
        .table-row:hover { background-color: rgba(255, 255, 255, 0.02); }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useDashboard } from '@/components/DashboardContext';
import EditableCustomerName from '@/components/EditableCustomerName';
import TableToolbar from '@/components/TableToolbar';

export default function Customers() {
  const { customers, loading, openModal } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (loading && customers.length === 0) return <div style={{ padding: '2rem' }}>Loading Customers...</div>;

  const filteredCustomers = customers.filter(c => {
    const query = searchQuery.toLowerCase();
    return (c.name || '').toLowerCase().includes(query) || (c.phone || '').includes(query);
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
    }
  };

  const handleBulkDelete = () => {
    openModal('bulk_delete_customers', null, null, { ids: selectedIds });
  };

  return (
    <div>
      <h1 className="page-title">Customers</h1>
      
      <TableToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search customers..."
        showSelectToggle={true}
        isSelectionMode={isSelectionMode}
        onSelectionToggle={() => {
          setIsSelectionMode(!isSelectionMode);
          setSelectedIds([]);
        }}
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDelete}
      />

      {/* DESKTOP VIEW */}
      <div style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderRadius: '8px', 
        border: '1px solid var(--color-border)', 
        maxHeight: '65vh',
        overflowY: 'auto'
      }} className="custom-scrollbar desktop-only">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#111', zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {isSelectionMode && (
                <th style={{ padding: '1rem 1.5rem', width: '40px', borderBottom: '1px solid var(--color-border)' }}>
                  <input type="checkbox" checked={selectedIds.length > 0 && selectedIds.length === filteredCustomers.length} onChange={toggleAll} style={{ cursor: 'pointer' }} />
                </th>
              )}
              <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>Name</th>
              <th style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>Phone</th>
              <th style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>Added</th>
              <th style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>Orders</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontWeight: 'normal', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer: any) => (
              <tr key={customer.id} className="table-row">
                {isSelectionMode && (
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <input type="checkbox" checked={selectedIds.includes(customer.id)} onChange={() => toggleSelect(customer.id)} style={{ cursor: 'pointer' }} />
                  </td>
                )}
                <td style={{ padding: '1rem 1.5rem' }}>
                  <EditableCustomerName id={customer.id} name={customer.name} phone={customer.phone} />
                </td>
                <td style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>{customer.phone}</td>
                <td style={{ padding: '1rem 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{customer.total_orders || 0}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button onClick={() => openModal('delete_customer', customer.id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px', fontSize: '14px' }} title="Delete customer">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="mobile-only">
        {filteredCustomers.map((customer: any) => (
          <div key={customer.id} className="mobile-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {isSelectionMode && (
                <input type="checkbox" checked={selectedIds.includes(customer.id)} onChange={() => toggleSelect(customer.id)} style={{ width: '20px', height: '20px' }} />
              )}
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{customer.name || 'New Customer'}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{customer.phone}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px' }}>{customer.total_orders || 0} orders placed</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={() => openModal('rename', customer.id, customer.name)} 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#666', padding: '0.75rem', borderRadius: '8px' }}
              >✏️</button>
              <button 
                onClick={() => openModal('delete_customer', customer.id)} 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#666', padding: '0.75rem', borderRadius: '8px' }}
              >🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .table-row { border-bottom: 1px solid var(--color-border); transition: background-color 0.2s; }
        .table-row:hover { background-color: rgba(255, 255, 255, 0.02); }
      `}</style>
    </div>
  );
}

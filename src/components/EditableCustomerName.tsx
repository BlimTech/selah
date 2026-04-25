'use client';

import { useDashboard } from '@/components/DashboardContext';

interface EditableCustomerNameProps {
  id: string;
  name?: string;
  phone: string;
}

export default function EditableCustomerName({ id, name, phone }: EditableCustomerNameProps) {
  const { openModal } = useDashboard();

  const displayName = name ? `${name} (${phone})` : `Unknown (${phone})`;

  return (
    <div className="editable-name-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontWeight: name ? 'bold' : 'normal', color: name ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>
        {displayName}
      </span>
      <button 
        onClick={() => openModal('rename', id, name)} 
        style={{ 
          cursor: 'pointer', 
          background: 'none', 
          border: 'none', 
          padding: '2px', 
          fontSize: '12px',
          opacity: 0.3,
          transition: 'opacity 0.2s ease'
        }}
        className="edit-pencil-btn"
        title="Rename customer"
      >
        ✏️
      </button>
      <style jsx>{`
        .editable-name-container:hover .edit-pencil-btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

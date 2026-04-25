'use client';

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  showStatusFilter?: boolean;
  statusFilter?: string;
  onStatusChange?: (val: string) => void;
  
  // Selection Mode
  showSelectToggle?: boolean;
  isSelectionMode?: boolean;
  onSelectionToggle?: () => void;
  selectedCount?: number;
  onBulkDelete?: () => void;
}

export default function TableToolbar({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  showStatusFilter = false,
  statusFilter = 'all',
  onStatusChange,
  showSelectToggle = false,
  isSelectionMode = false,
  onSelectionToggle,
  selectedCount = 0,
  onBulkDelete
}: TableToolbarProps) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '1rem', 
      marginBottom: '1rem', 
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', opacity: 0.5 }}>🔍</span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '10px 12px 10px 36px',
              color: 'var(--color-text)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            className="search-input"
          />
        </div>

        {showStatusFilter && onStatusChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px 12px', color: 'var(--color-text)', fontSize: '13px', outline: 'none' }}
            >
              <option value="all">All Orders</option>
              <option value="unpaid">Unpaid</option>
              <option value="draft">Draft</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {selectedCount > 0 && onBulkDelete && (
          <button 
            onClick={onBulkDelete}
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid #EF4444', 
              color: '#EF4444', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            DELETE SELECTED ({selectedCount})
          </button>
        )}

        {showSelectToggle && onSelectionToggle && (
          <button 
            onClick={onSelectionToggle}
            style={{ 
              backgroundColor: isSelectionMode ? '#333' : 'transparent', 
              border: '1px solid #333', 
              color: isSelectionMode ? 'white' : 'var(--color-text-secondary)', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            {isSelectionMode ? 'CANCEL SELECTION' : 'SELECT'}
          </button>
        )}
      </div>

      <style jsx>{`
        .search-input:focus { border-color: #EF4444; }
      `}</style>
    </div>
  );
}

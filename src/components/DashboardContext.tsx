'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface DashboardContextType {
  summary: {
    totalDebt: number;
    unpaidCount: number;
    todayCount: number;
  } | null;
  orders: any[];
  customers: any[];
  debts: any[];
  pagination: {
    page: number;
    hasMore: boolean;
  };
  loading: boolean;
  error: boolean;
  page: number;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;

  // Modal State
  activeModal: { type: 'rename' | 'delete' | 'set_price' | 'confirm_order' | 'delete_customer' | 'bulk_delete_customers' | 'manual_order', id: string | null, name?: string | null, data?: any } | null;
  openModal: (type: 'rename' | 'delete' | 'set_price' | 'confirm_order' | 'delete_customer' | 'bulk_delete_customers' | 'manual_order', id: string | null, name?: string | null, data?: any) => void;
  closeModal: () => void;

  // Settings
  defaultPrice: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [defaultPrice, setDefaultPrice] = useState(5000);

  const fetchAll = async (p = page) => {
    setLoading(true);
    try {
      const [dashRes, settingsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/dashboard?page=${p}`),
        fetch(`${BASE_URL}/api/settings`)
      ]);

      if (!dashRes.ok || !settingsRes.ok) throw new Error('Failed to fetch');

      const dashJson = await dashRes.json();
      const settingsJson = await settingsRes.json();

      setData(dashJson);
      setDefaultPrice(settingsJson.default_price);
      setError(false);
    } catch (err) {
      console.error('Unified Fetch Error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: any, id: string, name?: string, data?: any) => {
    setActiveModal({ type, id, name, data });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAll(page);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [page]);

  const value = {
    summary: data?.summary || null,
    orders: data?.orders || [],
    customers: data?.customers || [],
    debts: data?.debts || [],
    pagination: data?.pagination || { page: 1, hasMore: false },
    loading,
    error,
    page,
    setPage,
    refresh: () => fetchAll(page),
    activeModal,
    openModal,
    closeModal,
    defaultPrice,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

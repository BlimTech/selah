import { supabaseServer as supabase } from '@/lib/supabase/server';

export const DashboardService = {
  async getStats(page: number = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [statsResult, todayResult, ordersResult, customersResult] = await Promise.all([
      // 1. Total Outstanding Summary
      supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'unpaid'),

      // 2. Today's Order Count
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),

      // 3. Paginated Orders (Unified List)
      supabase
        .from('orders')
        .select('*, customers(name, phone), messages(message_text)')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),

      // 4. Customers Aggregation (for Customers and Debts views)
      supabase
        .from('customers')
        .select('id, name, phone, created_at, orders(total_price, status)')
    ]);

    if (statsResult.error) throw statsResult.error;
    if (todayResult.error) throw todayResult.error;
    if (ordersResult.error) throw ordersResult.error;
    if (customersResult.error) throw customersResult.error;

    // Process Customers and Debts
    const formattedCustomers = (customersResult.data as any[])?.map(c => {
      const orders = (c.orders as any[]) || [];
      const totalDebt = orders
        .filter(o => o.status === 'unpaid')
        .reduce((sum, o) => sum + Number(o.total_price || 0), 0);

      return {
        id: c.id,
        name: c.name || 'New Customer',
        phone: c.phone,
        created_at: c.created_at,
        total_orders: orders.length,
        total_debt: totalDebt,
        unpaid_orders_count: orders.filter(o => o.status === 'unpaid').length
      };
    }) || [];

    const totalOutstanding = statsResult.data?.reduce((sum, o) => sum + Number(o.total_price || 0), 0) || 0;

    return {
      summary: {
        totalDebt: totalOutstanding,
        unpaidCount: statsResult.data?.length || 0,
        todayCount: todayResult.count || 0
      },
      orders: ordersResult.data || [],
      customers: formattedCustomers,
      debts: formattedCustomers.filter(c => c.total_debt > 0),
      pagination: {
        page,
        hasMore: (ordersResult.data?.length || 0) === limit
      }
    };
  }
};

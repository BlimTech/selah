import { supabaseServer as supabase } from '@/lib/supabase/server';

export const SettingsService = {
  async get() {
    const { data, error } = await supabase
      .from('distributors')
      .select('default_price')
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  async update(default_price: number) {
    // For single-user MVP, we just update the first row
    const { data: dist, error: fetchError } = await supabase
      .from('distributors')
      .select('id')
      .limit(1)
      .single();
    
    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('distributors')
      .update({ default_price })
      .eq('id', dist.id);

    if (error) throw error;
  }
};

import { supabase } from '../config/supabase.js';

export const expenseService = {
  async getAllExpenses(userId) {
    if (!userId) throw new Error('user_id is required');
    const { data, error } = await supabase
      .from('expenses')
      .select('id, user_id, title, amount, category, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addExpense(expenseData) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select('id, user_id, title, amount, category, created_at');
    if (error) throw error;
    return data[0];
  }
};

export const goalService = {
  async getAllGoals(userId) {
    if (!userId) throw new Error('user_id is required');
    const { data, error } = await supabase
      .from('goals')
      .select('id, user_id, target, saved, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addGoal(goalData) {
    const { data, error } = await supabase
      .from('goals')
      .insert([goalData])
      .select('id, user_id, target, saved, created_at');
    if (error) throw error;
    return data[0];
  },

  async deleteGoal(id) {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async updateGoalSaved(id, savedAmount) {
    const { data, error } = await supabase
      .from('goals')
      .update({ saved: savedAmount })
      .eq('id', id)
      .select('id, user_id, target, saved, created_at');
    if (error) throw error;
    return data[0];
  }
};

export const settingsService = {
  async getSettings(userId) {
    if (!userId) throw new Error('user_id is required');
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createSettings(settingsData) {
    const { data, error } = await supabase
      .from('user_settings')
      .insert([settingsData])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateSettings(userId, updateData) {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updateData)
      .eq('user_id', userId)
      .select();
    if (error) throw error;
    return data[0];
  }
};

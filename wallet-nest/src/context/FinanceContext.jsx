import { useEffect, useMemo, useState, useCallback } from 'react';
import { FinanceContext } from './FinanceCtx';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const defaultCategories = [
  { id: 'cat-1', name: 'Food', iconType: 'Utensils', color: 'text-orange-500 bg-orange-100 dark:bg-orange-500/20', isDefault: true },
  { id: 'cat-2', name: 'Travel', iconType: 'Plane', color: 'text-sky-500 bg-sky-100 dark:bg-sky-500/20', isDefault: true },
  { id: 'cat-3', name: 'Shopping', iconType: 'ShoppingBag', color: 'text-pink-500 bg-pink-100 dark:bg-pink-500/20', isDefault: true },
  { id: 'cat-4', name: 'Bills', iconType: 'Receipt', color: 'text-red-500 bg-red-100 dark:bg-red-500/20', isDefault: true },
  { id: 'cat-5', name: 'Study', iconType: 'BookOpen', color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20', isDefault: true },
  { id: 'cat-6', name: 'Other', iconType: 'Box', color: 'text-gray-500 bg-gray-100 dark:bg-gray-500/20', isDefault: true },
];

const isExpense = (tx) => tx.amount < 0;
const isInCurrentMonth = (dateValue) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return false;
  const now = new Date();
  return (
    parsed.getFullYear() === now.getFullYear()
    && parsed.getMonth() === now.getMonth()
  );
};

const formatSupabaseActionError = (error, entityName) => {
  const message = error?.message || 'Unknown Supabase error.';
  const code = error?.code || '';
  if (!supabaseConfigured) {
    return 'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  }
  if (code === '42501') {
    return `Permission denied while writing ${entityName}. Check RLS policies for auth.uid() = user_id.`;
  }
  if (code === '42P01') {
    return `${entityName} table not found. Verify Supabase schema has this table.`;
  }
  if (code === '23502') {
    return `Schema mismatch while saving ${entityName}. Verify required columns and payload fields.`;
  }
  return message;
};

export function FinanceProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [monthlyBudget, setMonthlyBudgetLocal] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [categories, setCategoriesLocal] = useState(defaultCategories);
  const [dataLoading, setDataLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const refreshData = useCallback(async () => {
    if (!userId) return false;
    if (!supabaseConfigured) {
      setActionError('Supabase environment variables are missing. Update your .env and restart the app.');
      return false;
    }

    setDataLoading(true);

    const [expRes, goalRes, settingsRes] = await Promise.all([
      supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }),
      supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single(),
    ]);

    const settingsMissing = settingsRes.error?.code === 'PGRST116';
    if (expRes.error || goalRes.error || (settingsRes.error && !settingsMissing)) {
      console.error('refreshData error:', {
        expenses: expRes.error?.message,
        goals: goalRes.error?.message,
        settings: settingsRes.error?.message,
      });
      setActionError(
        formatSupabaseActionError(
          expRes.error || goalRes.error || settingsRes.error,
          expRes.error ? 'expenses' : goalRes.error ? 'goals' : 'user settings',
        ),
      );
      setDataLoading(false);
      return false;
    }

    setTransactions(
      (expRes.data || []).map((r) => ({
        id: r.id,
        title: r.title,
        amount: Number(r.amount),
        category: r.category,
        date: r.date,
        mood: r.mood,
        note: r.note,
      })),
    );

    setGoals(
      (goalRes.data || []).map((r) => ({
        id: r.id,
        title: r.title,
        target: Number(r.target),
        saved: Number(r.saved),
      })),
    );

    if (settingsRes.data) {
      setMonthlyBudgetLocal(Number(settingsRes.data.monthly_budget));
      const storedCats = settingsRes.data.categories;
      if (Array.isArray(storedCats) && storedCats.length > 0) {
        setCategoriesLocal(storedCats);
      }
    } else {
      await supabase.from('user_settings').insert({
        user_id: userId,
        monthly_budget: 0,
        categories: defaultCategories,
      });
    }

    setDataLoading(false);
    setActionError('');
    return true;
  }, [userId]);

  // ------------------------------------------------------------------
  // Fetch all user data from Supabase on login / mount
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!userId) {
      // User logged out — reset to defaults
      setTransactions([]);
      setGoals([]);
      setMonthlyBudgetLocal(0);
      setCategoriesLocal(defaultCategories);
      setDataLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      if (cancelled) return;
      await refreshData();
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [userId, refreshData]);

  // ------------------------------------------------------------------
  // Metrics (derived — zero changes from original)
  // ------------------------------------------------------------------
  const metrics = useMemo(() => {
    const monthTransactions = transactions.filter((tx) => isInCurrentMonth(tx.date));
    const monthExpenses = monthTransactions.filter(isExpense);

    const income = monthTransactions
      .filter((tx) => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = monthExpenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const remaining = monthlyBudget - expenses;
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const spendingRate = expenses / Math.max(1, dayOfMonth);
    const predictedMonthEnd = monthlyBudget - Math.round(spendingRate * daysInMonth);

    const categoryTotals = monthExpenses
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
        return acc;
      }, {});

    return {
      income,
      expenses,
      remaining,
      balance: income - expenses,
      spentPercent: Math.min(100, Math.round((expenses / Math.max(1, monthlyBudget)) * 100)),
      predictedMonthEnd,
      categoryTotals,
    };
  }, [monthlyBudget, transactions]);

  // ------------------------------------------------------------------
  // CRUD actions — write to Supabase, optimistic local updates
  // ------------------------------------------------------------------
  const addExpense = useCallback(
    async ({ title, note, amount, category, date, mood }) => {
      if (!userId) return false;
      if (!supabaseConfigured) {
        setActionError('Supabase environment variables are missing. Update your .env and restart the app.');
        return false;
      }
      const normalizedAmount = Number(amount);
      if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) return false;
      setActionError('');

      const row = {
        user_id: userId,
        title: title || note || `${category || 'Other'} Expense`,
        amount: -Math.abs(normalizedAmount),
        category: category || 'Other',
        date,
        mood,
        note,
      };

      const { error } = await supabase
        .from('expenses')
        .insert(row);

      if (error) {
        console.error('addExpense error:', error.message);
        setActionError(formatSupabaseActionError(error, 'expenses'));
        return false;
      }

      await refreshData();
      return true;
    },
    [userId, refreshData],
  );

  const addGoal = useCallback(
    async ({ title, target }) => {
      if (!userId) return false;
      if (!supabaseConfigured) {
        setActionError('Supabase environment variables are missing. Update your .env and restart the app.');
        return false;
      }
      const trimmedTitle = title?.trim();
      const normalizedTarget = Number(target);
      if (!trimmedTitle || !Number.isFinite(normalizedTarget) || normalizedTarget <= 0) return false;
      setActionError('');

      const { error } = await supabase
        .from('goals')
        .insert({ user_id: userId, title: trimmedTitle, target: normalizedTarget, saved: 0 });

      if (error) {
        console.error('addGoal error:', error.message);
        setActionError(formatSupabaseActionError(error, 'goals'));
        return false;
      }

      await refreshData();
      return true;
    },
    [userId, refreshData],
  );

  const removeGoal = useCallback(async (id) => {
    if (!id) return false;
    if (!supabaseConfigured) {
      setActionError('Supabase environment variables are missing. Update your .env and restart the app.');
      return false;
    }
    setActionError('');
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      console.error('removeGoal error:', error.message);
      setActionError(formatSupabaseActionError(error, 'goals'));
      return false;
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
    return true;
  }, []);

  const addContribution = useCallback(async (id, amount) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return false;
    if (!supabaseConfigured) {
      setActionError('Supabase environment variables are missing. Update your .env and restart the app.');
      return false;
    }
    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) return false;
    setActionError('');

    const newSaved = goal.saved + normalizedAmount;
    const { error } = await supabase
      .from('goals')
      .update({ saved: newSaved })
      .eq('id', id);

    if (error) {
      console.error('addContribution error:', error.message);
      setActionError(formatSupabaseActionError(error, 'goals'));
      return false;
    }

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: newSaved } : g)),
    );
    return true;
  }, [goals]);

  const setBudget = useCallback(
    async (nextBudget) => {
      setMonthlyBudgetLocal(nextBudget);
      const { error } = await supabase
        .from('user_settings')
        .update({ monthly_budget: nextBudget })
        .eq('user_id', userId);

      if (error) console.error('setBudget error:', error.message);
      if (error) setActionError(error.message || 'Failed to update budget.');
    },
    [userId],
  );

  const addCategory = useCallback(
    async (name) => {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        iconType: 'Tag',
        color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20',
        isDefault: false,
      };
      const updated = [...categories, newCat];
      setCategoriesLocal(updated);

      const { error } = await supabase
        .from('user_settings')
        .update({ categories: updated })
        .eq('user_id', userId);

      if (error) console.error('addCategory error:', error.message);
    },
    [categories, userId],
  );

  const removeCategory = useCallback(
    async (id) => {
      const updated = categories.filter((c) => c.id !== id);
      setCategoriesLocal(updated);

      const { error } = await supabase
        .from('user_settings')
        .update({ categories: updated })
        .eq('user_id', userId);

      if (error) console.error('removeCategory error:', error.message);
    },
    [categories, userId],
  );

  // ------------------------------------------------------------------
  // Provider value — identical shape to the original
  // ------------------------------------------------------------------
  const value = {
    monthlyBudget,
    setMonthlyBudget: setBudget,
    transactions,
    goals,
    categories,
    metrics,
    actionError,
    addExpense,
    addGoal,
    removeGoal,
    addContribution,
    addCategory,
    removeCategory,
    refreshData,
    dataLoading,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

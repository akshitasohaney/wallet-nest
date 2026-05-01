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
  const message = error?.message || 'Unknown API error.';
  return message;
};

const API_URL = import.meta.env.PROD 
  ? '/api' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787/api');

const apiFetch = async (endpoint, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'API Error');
  }
  return data;
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

    setDataLoading(true);

    const [expRes, goalRes, settingsRes] = await Promise.all([
      apiFetch(`/expenses?userId=${userId}`)
        .then(res => ({ data: res.data }))
        .catch(err => ({ error: err })),
      apiFetch(`/goals?userId=${userId}`)
        .then(res => ({ data: res.data }))
        .catch(err => ({ error: err })),
      apiFetch(`/settings?userId=${userId}`)
        .then(res => ({ data: res.data }))
        .catch(err => ({ error: err }))
    ]);

    // Process expenses independently
    if (expRes.error) {
      console.error('expenses fetch error:', expRes.error);
      setActionError(formatSupabaseActionError(expRes.error, 'expenses'));
    } else {
      console.log('Fetched expenses:', expRes.data);
      setTransactions(
        (expRes.data || []).map((r) => ({
          id: r.id,
          title: r.title,
          amount: Number(r.amount),
          category: r.category,
          date: r.created_at ? (r.created_at.includes('Z') || r.created_at.includes('+') ? r.created_at : r.created_at + 'Z') : new Date().toISOString(),
          mood: r.mood || null,
          note: r.note || null,
        })),
      );
    }

    // Process goals independently
    if (goalRes.error) {
      console.error('goals fetch error:', goalRes.error);
    } else {
      console.log('Fetched goals:', goalRes.data);
      const localGoalTitles = JSON.parse(localStorage.getItem(`goal_titles_${userId}`) || '{}');
      setGoals(
        (goalRes.data || [])
          .filter(r => r.name || r.title || localGoalTitles[r.id])
          .map((r) => ({
          id: r.id,
          title: r.title || r.name || localGoalTitles[r.id] || 'Unnamed Goal',
          target: Number(r.target),
          saved: Number(r.saved),
        })),
      );
    }

    if (settingsRes.data) {
      setMonthlyBudgetLocal(Number(settingsRes.data.monthly_budget));
      const storedCats = settingsRes.data.categories;
      if (Array.isArray(storedCats) && storedCats.length > 0) {
        setCategoriesLocal(storedCats);
      }
    } else {
      // Fallback to localStorage
      const localBudget = localStorage.getItem(`budget_${userId}`);
      if (localBudget) setMonthlyBudgetLocal(Number(localBudget));
      
      const localCats = localStorage.getItem(`cats_${userId}`);
      if (localCats) setCategoriesLocal(JSON.parse(localCats));

      // Attempt to create the row via API
      apiFetch(`/settings`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          monthly_budget: Number(localBudget) || 0,
          categories: localCats ? JSON.parse(localCats) : defaultCategories,
        })
      }).catch(() => {});
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
    const totalSavings = goals.reduce((sum, g) => sum + (Number(g.saved) || 0), 0);
    const remaining = monthlyBudget - expenses - totalSavings;
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const spendingRate = expenses / Math.max(1, dayOfMonth);
    const predictedMonthEnd = monthlyBudget - totalSavings - Math.round(spendingRate * daysInMonth);

    const categoryTotals = monthExpenses
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
        return acc;
      }, {});

    const totalSpent = expenses + totalSavings;

    return {
      income,
      expenses,
      totalSavings,
      remaining,
      balance: income - expenses,
      spentPercent: Math.min(100, Math.round((totalSpent / Math.max(1, monthlyBudget)) * 100)),
      predictedMonthEnd,
      categoryTotals,
    };
  }, [monthlyBudget, transactions, goals]);

  // ------------------------------------------------------------------
  // CRUD actions — write to Supabase, optimistic local updates
  // ------------------------------------------------------------------
  const addExpense = useCallback(
    async ({ title, note, amount, category, date, mood }) => {
      if (!userId) return false;
      const normalizedAmount = Number(amount);
      if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) return false;
      setActionError('');

      const payload = {
        user_id: userId,
        title: title || note || `${category || 'Other'} Expense`,
        amount: -Math.abs(normalizedAmount),
        category: category || 'Other',
      };

      try {
        const res = await apiFetch(`/expenses`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        console.log('addExpense success:', res.data);
        await refreshData();
        return true;
      } catch (error) {
        console.error('addExpense error:', error);
        setActionError(error.message);
        return false;
      }
    },
    [userId, refreshData],
  );

  const addGoal = useCallback(
    async ({ title, target }) => {
      if (!userId) return false;
      const trimmedTitle = title?.trim();
      const normalizedTarget = Number(target);
      if (!trimmedTitle || !Number.isFinite(normalizedTarget) || normalizedTarget <= 0) return false;
      setActionError('');

      try {
        const res = await apiFetch(`/goals`, {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, target: normalizedTarget, saved: 0, title: trimmedTitle }),
        });
        
        const newGoal = res.data;
        if (newGoal) {
          const localGoalTitles = JSON.parse(localStorage.getItem(`goal_titles_${userId}`) || '{}');
          localGoalTitles[newGoal.id] = trimmedTitle;
          localStorage.setItem(`goal_titles_${userId}`, JSON.stringify(localGoalTitles));
        }
        
        console.log('addGoal success:', res.data);
        await refreshData();
        return true;
      } catch (error) {
        console.error('addGoal error:', error);
        setActionError(error.message);
        return false;
      }
    },
    [userId, refreshData],
  );

  const removeGoal = useCallback(async (id) => {
    if (!id) return false;
    setActionError('');
    
    try {
      await apiFetch(`/goals/${id}`, { method: 'DELETE' });
      setGoals((prev) => prev.filter((g) => g.id !== id));
      
      if (userId) {
        const localGoalTitles = JSON.parse(localStorage.getItem(`goal_titles_${userId}`) || '{}');
        if (localGoalTitles[id]) {
          delete localGoalTitles[id];
          localStorage.setItem(`goal_titles_${userId}`, JSON.stringify(localGoalTitles));
        }
      }
      return true;
    } catch (error) {
      console.error('removeGoal error:', error);
      setActionError(error.message);
      return false;
    }
  }, [userId]);

  const addContribution = useCallback(async (id, amount) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return false;
    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) return false;
    setActionError('');

    const newSaved = goal.saved + normalizedAmount;
    
    try {
      await apiFetch(`/goals/${id}/contribute`, {
        method: 'PATCH',
        body: JSON.stringify({ saved: newSaved })
      });
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, saved: newSaved } : g)),
      );
      return true;
    } catch (error) {
      console.error('addContribution error:', error);
      setActionError(error.message);
      return false;
    }
  }, [goals]);

  const reduceContribution = useCallback(async (id, amount) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return false;
    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) return false;
    setActionError('');

    const newSaved = Math.max(0, goal.saved - normalizedAmount);
    
    try {
      await apiFetch(`/goals/${id}/contribute`, {
        method: 'PATCH',
        body: JSON.stringify({ saved: newSaved })
      });
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, saved: newSaved } : g)),
      );
      return true;
    } catch (error) {
      console.error('reduceContribution error:', error);
      setActionError(error.message);
      return false;
    }
  }, [goals]);

  const setBudget = useCallback(
    async (nextBudget) => {
      setMonthlyBudgetLocal(nextBudget);
      localStorage.setItem(`budget_${userId}`, nextBudget);
      
      apiFetch(`/settings`, {
        method: 'PATCH',
        body: JSON.stringify({ user_id: userId, monthly_budget: nextBudget })
      }).catch(err => console.error('setBudget error:', err));
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
      localStorage.setItem(`cats_${userId}`, JSON.stringify(updated));

      apiFetch(`/settings`, {
        method: 'PATCH',
        body: JSON.stringify({ user_id: userId, categories: updated })
      }).catch(err => console.error('addCategory error:', err));
    },
    [categories, userId],
  );

  const removeCategory = useCallback(
    async (id) => {
      const updated = categories.filter((c) => c.id !== id);
      setCategoriesLocal(updated);
      localStorage.setItem(`cats_${userId}`, JSON.stringify(updated));

      apiFetch(`/settings`, {
        method: 'PATCH',
        body: JSON.stringify({ user_id: userId, categories: updated })
      }).catch(err => console.error('removeCategory error:', err));
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
    reduceContribution,
    addCategory,
    removeCategory,
    refreshData,
    dataLoading,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

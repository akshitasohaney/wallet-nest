import { useEffect, useMemo, useState } from 'react';
import { FinanceContext } from './FinanceCtx';
import { getExpenses, getGoals, saveExpenses, saveGoals, getGenericData, saveGenericData } from '../utils/storage';

const initialGoals = [
  { id: 1, title: 'Emergency Buffer', saved: 1800, target: 4000 },
  { id: 2, title: 'Semester Books', saved: 700, target: 2500 },
];

const defaultCategories = [
  { id: 'cat-1', name: 'Food', iconType: 'Utensils', color: 'text-orange-500 bg-orange-100 dark:bg-orange-500/20', isDefault: true },
  { id: 'cat-2', name: 'Travel', iconType: 'Plane', color: 'text-sky-500 bg-sky-100 dark:bg-sky-500/20', isDefault: true },
  { id: 'cat-3', name: 'Shopping', iconType: 'ShoppingBag', color: 'text-pink-500 bg-pink-100 dark:bg-pink-500/20', isDefault: true },
  { id: 'cat-4', name: 'Bills', iconType: 'Receipt', color: 'text-red-500 bg-red-100 dark:bg-red-500/20', isDefault: true },
  { id: 'cat-5', name: 'Study', iconType: 'BookOpen', color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20', isDefault: true },
  { id: 'cat-6', name: 'Other', iconType: 'Box', color: 'text-gray-500 bg-gray-100 dark:bg-gray-500/20', isDefault: true }
];

const isExpense = (tx) => tx.amount < 0;

export function FinanceProvider({ children }) {
  const [monthlyBudget, setMonthlyBudget] = useState(() => getGenericData('wn_budget', 8000));
  const [transactions, setTransactions] = useState(() => getExpenses());
  const [goals, setGoals] = useState(() => getGoals(initialGoals));
  const [categories, setCategories] = useState(() => getGenericData('wn_categories', defaultCategories));
  const [financeLoading, setFinanceLoading] = useState(false);

  // Sync state to local storage on change using utility routes
  useEffect(() => {
    saveGenericData('wn_budget', monthlyBudget);
    saveExpenses(transactions);
    saveGoals(goals);
    saveGenericData('wn_categories', categories);
  }, [monthlyBudget, transactions, goals, categories]);

  const metrics = useMemo(() => {
    const income = transactions.filter((tx) => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = transactions.filter(isExpense).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const remaining = monthlyBudget - expenses;
    const spendingRate = expenses / Math.max(1, new Date().getDate());
    const predictedMonthEnd = monthlyBudget - Math.round(spendingRate * 30);

    const categoryTotals = transactions
      .filter(isExpense)
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

  const addExpense = async ({ title, note, amount, category, date, mood }) => {
    const newTx = {
      id: Date.now(),
      title: title || note || `${category} Expense`,
      amount: -Math.abs(Number(amount)),
      category,
      date,
      mood,
      note
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const addGoal = async ({ title, target }) => {
    const newGoal = { id: Date.now(), title: title.trim(), saved: 0, target: Number(target) };
    setGoals((prev) => [...prev, newGoal]);
  };

  const removeGoal = async (id) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const addContribution = async (id, amount) => {
    setGoals((prev) => 
      prev.map((goal) => 
        goal.id === id ? { ...goal, saved: goal.saved + Number(amount) } : goal
      )
    );
  };

  const addCategory = (name) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      iconType: 'Tag', 
      color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20',
      isDefault: false
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const removeCategory = (id) => {
    setCategories((prev) => prev.filter(c => c.id !== id));
  };

  const setBudget = async (nextBudget) => {
    setMonthlyBudget(nextBudget);
  };

  const value = {
    monthlyBudget,
    setMonthlyBudget: setBudget,
    transactions,
    goals,
    categories,
    metrics,
    addExpense,
    addGoal,
    removeGoal,
    addContribution,
    addCategory,
    removeCategory,
    financeLoading,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

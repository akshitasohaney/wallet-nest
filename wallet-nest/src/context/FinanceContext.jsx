import { useMemo, useState } from 'react';
import { FinanceContext } from './FinanceCtx';

const initialTransactions = [
  { id: 1, title: 'College Canteen', category: 'Food', amount: -180, date: '2026-04-03' },
  { id: 2, title: 'Scholarship Credit', category: 'Income', amount: 5000, date: '2026-04-01' },
  { id: 3, title: 'Bus Pass', category: 'Transport', amount: -600, date: '2026-04-05' },
  { id: 4, title: 'Netflix Subscription', category: 'Subscriptions', amount: -199, date: '2026-04-08' },
  { id: 5, title: 'Library Printouts', category: 'Academics', amount: -120, date: '2026-04-10' },
  { id: 6, title: 'Part-Time Payment', category: 'Income', amount: 2800, date: '2026-04-12' },
  { id: 7, title: 'Cafe Outing', category: 'Food', amount: -350, date: '2026-04-15' },
];

const initialGoals = [
  { id: 1, title: 'Emergency Buffer', saved: 1800, target: 4000 },
  { id: 2, title: 'Semester Books', saved: 700, target: 2500 },
  { id: 3, title: 'Fest Trip', saved: 1200, target: 3000 },
];

const isExpense = (tx) => tx.amount < 0;

export function FinanceProvider({ children }) {
  const [monthlyBudget, setMonthlyBudget] = useState(8000);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [goals, setGoals] = useState(initialGoals);

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

  const addExpense = ({ title, amount, category, date }) => {
    setTransactions((prev) => [
      {
        id: Date.now(),
        title: title.trim(),
        amount: -Math.abs(Number(amount)),
        category,
        date,
      },
      ...prev,
    ]);
  };

  const addGoal = ({ title, target }) => {
    setGoals((prev) => [...prev, { id: Date.now(), title: title.trim(), saved: 0, target: Number(target) }]);
  };

  const value = {
    monthlyBudget,
    setMonthlyBudget,
    transactions,
    goals,
    metrics,
    addExpense,
    addGoal,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

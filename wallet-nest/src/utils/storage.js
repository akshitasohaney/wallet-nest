// Storage Utility Helpers

export const getExpenses = () => {
  try {
    const data = window.localStorage.getItem('wn_transactions');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveExpenses = (expenses) => {
  window.localStorage.setItem('wn_transactions', JSON.stringify(expenses));
};

export const saveExpense = (expense) => {
  const current = getExpenses();
  saveExpenses([expense, ...current]);
};

export const getGoals = (fallback = []) => {
  try {
    const data = window.localStorage.getItem('wn_goals');
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const saveGoals = (goals) => {
  window.localStorage.setItem('wn_goals', JSON.stringify(goals));
};

export const saveGoal = (goal) => {
  const current = getGoals([]);
  saveGoals([...current, goal]);
};

export const getGenericData = (key, fallback) => {
  try {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const saveGenericData = (key, payload) => {
  window.localStorage.setItem(key, JSON.stringify(payload));
};

import { apiRequest } from '../lib/apiClient';

export function fetchFinanceData(token) {
  return apiRequest('/finance', { token });
}

export function createExpense(payload, token) {
  return apiRequest('/finance/transactions', { method: 'POST', body: payload, token });
}

export function createGoal(payload, token) {
  return apiRequest('/finance/goals', { method: 'POST', body: payload, token });
}

export function updateBudget(payload, token) {
  return apiRequest('/finance/budget', { method: 'PATCH', body: payload, token });
}


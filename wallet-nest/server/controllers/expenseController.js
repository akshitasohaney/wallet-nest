import { expenseService } from '../services/supabaseService.js';

export const getExpenses = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId query parameter is required' });
    }
    const expenses = await expenseService.getAllExpenses(userId);
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { user_id, title, amount, category, created_at, mood, note } = req.body;
    
    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newExpense = await expenseService.addExpense({
      user_id,
      title,
      amount,
      category
      // omitting date, mood, and note to prevent schema cache errors if they are missing
    });

    res.status(201).json({ success: true, data: newExpense });
  } catch (error) {
    next(error);
  }
};

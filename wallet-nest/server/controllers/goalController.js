import { goalService } from '../services/supabaseService.js';

export const getGoals = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const token = req.headers.authorization?.split(' ')[1];
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId query parameter is required' });
    }
    const goals = await goalService.getAllGoals(userId, token);
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { user_id, title, target, saved, name } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    // Accept target or target_amount
    const targetAmount = target;
    
    if (!user_id || targetAmount === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newGoal = await goalService.addGoal({
      user_id,
      name: title || name || 'Unnamed Goal',
      target: targetAmount,
      saved: saved || 0,
    }, token);

    res.status(201).json({ success: true, data: newGoal });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!id) return res.status(400).json({ success: false, error: 'Goal ID is required' });
    
    await goalService.deleteGoal(id, token);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateContribution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { saved } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!id || saved === undefined) {
      return res.status(400).json({ success: false, error: 'Goal ID and saved amount are required' });
    }

    const updatedGoal = await goalService.updateGoalSaved(id, saved, token);
    res.status(200).json({ success: true, data: updatedGoal });
  } catch (error) {
    next(error);
  }
};

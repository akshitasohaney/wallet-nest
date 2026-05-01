import { settingsService } from '../services/supabaseService.js';

export const getSettings = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId query parameter is required' });
    }
    const settings = await settingsService.getSettings(userId);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { user_id, monthly_budget, categories } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Check if settings exist
    const existing = await settingsService.getSettings(user_id);
    
    let result;
    if (!existing) {
      result = await settingsService.createSettings({
        user_id,
        monthly_budget: monthly_budget || 0,
        categories: categories || []
      });
    } else {
      const updates = {};
      if (monthly_budget !== undefined) updates.monthly_budget = monthly_budget;
      if (categories !== undefined) updates.categories = categories;
      
      result = await settingsService.updateSettings(user_id, updates);
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

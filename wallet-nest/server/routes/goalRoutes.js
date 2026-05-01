import express from 'express';
import { getGoals, createGoal, deleteGoal, updateContribution } from '../controllers/goalController.js';

const router = express.Router();

router.get('/', getGoals);
router.post('/', createGoal);
router.delete('/:id', deleteGoal);
router.patch('/:id/contribute', updateContribution);

export default router;

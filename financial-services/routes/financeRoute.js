import express from 'express';
import {createUserFinance} from "../controllers/financeController.js"

const router = express.Router();

// Define the routes
router.post('/createFinance', async (req, res) => {
  try {
    const userId = req.body.userId;
    const financeData = req.body.financeDetails;
    const userFinance = await createUserFinance(userId, financeData);
    res.status(201).json(userFinance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

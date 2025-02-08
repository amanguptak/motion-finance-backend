import express from 'express';
import {createUserFinance,updateUserFinance} from "../controllers/financeController.js"

const router = express.Router();

// Define the routes
router.post("/finance/create", createUserFinance);
router.put("/finance/update" ,updateUserFinance);
export default router;

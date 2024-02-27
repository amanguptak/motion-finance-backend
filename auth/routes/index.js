import { Router} from "express";
import AuthRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router()

router.use("/api",AuthRoutes)
router.use("/api",userRoutes)

export default router;

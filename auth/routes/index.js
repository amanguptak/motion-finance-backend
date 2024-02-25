import { Router} from "express";
import AuthRoutes from "./authRotes.js";


const router = Router()

router.use("/api",AuthRoutes)

export default router;

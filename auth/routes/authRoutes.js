import {Router} from "express"

import AuthController from "../controller/AuthControler.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = Router()

router.post("/auth/register",AuthController.register)
router.post("/auth/login",AuthController.login)
router.post("/auth/logout",verifyToken,AuthController.logout)
router.post("/auth/otp",AuthController.requestOtp)
router.post("/auth/verify",AuthController.verifiedOtp)
router.post("/auth/reset-password",AuthController.resetPassword)

export default router;
import {Router} from "express"

import AuthController from "../controller/AuthControler.js"

const router = Router()

router.post("/auth/register",AuthController.register)
router.post("/auth/login",AuthController.login)
router.post("/auth/logout",AuthController.logout)
router.post("/auth/otp",AuthController.requestOtp)


export default router;
import {Router} from "express"

import AuthController from "../controller/AuthControler.js"

const router = Router()

router.post("/auth/register",AuthController.register)


export default router;
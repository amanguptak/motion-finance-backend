import {Router} from "express"
import UserController from "../controller/UserControler.js"
import { verifyToken } from "../utils/token.js"
const router = Router()

router.get("/user",verifyToken,UserController.getUser)



export default router;
import {Router} from "express"
import UserController from "../controller/UserControler.js"
import { verifyToken } from "../middleware/verifyToken.js"
const router = Router()

router.get("/user",verifyToken,UserController.getUser)
router.put("/user-update",verifyToken,UserController.updateUser)
router.put("/password-update",verifyToken,UserController.changePassword)



export default router;
import {Router} from "express"
import UserController from "../controller/UserControler.js"
import { verifyToken } from "../middleware/verifyToken.js"
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const router = Router()

router.get("/user",verifyToken,UserController.getUser)
router.put("/user-update",verifyToken,UserController.updateUser)
router.put("/password-update",verifyToken,UserController.changePassword)
router.post("/upload-image", verifyToken, upload.single('profile'), UserController.handleImage);



export default router;
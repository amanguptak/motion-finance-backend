import prisma from "../config/db.config.js";
import bcrypt from "bcrypt"
import { sendToken } from "../utils/token.js";
class AuthController{
    static async register(req,res){
      try{
        const payload = req.body;
        const salt = bcrypt.genSaltSync(10);
        payload.password = bcrypt.hashSync(payload.password ,salt)

        const user = await prisma.user.create({
            data:payload
        })
        sendToken(req, res, user);
        // return res.json({message: "User created successfully",user})

      }catch(err){
        
        console.log("Error registering",err)
        return res.status(500).json({message:"Something went wrong"})
      }
    }
}

export default AuthController
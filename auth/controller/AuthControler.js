import prisma from "../config/db.config.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/token.js";
import { sendOtp, verifyOtp } from "../utils/sendOtp.js";
class AuthController {
  static async register(req, res) {
    try {
      const payload = req.body;
      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      const user = await prisma.user.create({
        data: payload,
      });
      sendToken(req, res, user, 201);
      // return res.json({message: "User created successfully",user})
    } catch (err) {
      console.log("Error registering", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      sendToken(req, res, user, 200);
    } catch (err) {
      console.log("Error login", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async logout(req, res) {
    try {
      res
        .clearCookie("authToken", {
          httpOnly: true,
          sameSite: "None",
          secure: true, // Adjust sameSite attribute as needed
        })
        .status(200)
        .json({ success: true, message: "Logged out successfully" });

      // req.session.destroy();
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ success: false, message: "Error logging out" });
    }
  }

  static async requestOtp(req, res) {
    try{
      const {email , subject ,message , duration} = req.body;

      const createdOtp = await sendOtp({email , subject ,message , duration})
      res.status(200).json({ success: createdOtp})
    }catch(error){
      res.status(500).json({ message: "Something went wrong" });
    }
  }


  static async verifiedOtp(req, res) {
    try{
      let {email ,otp} = req.body;
      const validOtp = await verifyOtp({email ,otp});
      res.status(200).json({
        success:true,
        valid : validOtp
      })
    }catch(error){
      res.status(400).json({ message: error.message });
    }
  }
}

export default AuthController;

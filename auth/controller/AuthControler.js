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

      const userData = { email: user.email, id: user.id };
      await req.producer.send({
        topic: "user-register",
        messages: [{ value: JSON.stringify(userData) }],
      });
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
      // Produce Kafka message
      const userData = { email: user.email, id: user.id };
      await req.producer.send({
        topic: "user-login",
        messages: [{ value: JSON.stringify(userData) }],
      });
    } catch (err) {
      console.log("Error login", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  static async logout(req, res) {
    try {
      const { email } = req.user; // Assuming req.user contains the logged-in user's info

      // Produce Kafka message before sending the response
      const userData = { email };
      await req.producer.send({
        topic: "user-logout",
        messages: [{ value: JSON.stringify(userData) }],
      });

      res
        .clearCookie("authToken", {
          httpOnly: true,
          sameSite: "None",
          secure: true, // Adjust sameSite attribute as needed
        })
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ success: false, message: "Error logging out" });
    }
  }

  static async requestOtp(req, res) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found  Please Register" });
      }
      const subject = "Reset-Password OTP";
      const message = "Hi 😀 Reset your account password with code below";
      const createdOtp = await sendOtp({ email, subject, message });
      res.status(200).json(createdOtp);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async verifiedOtp(req, res) {
    try {
      let { email, otp } = req.body;
      const validOtp = await verifyOtp({ email, otp });
      res.status(200).json({
        valid: validOtp,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { email, newPassword, otp } = req.body;
      // const user = await prisma.user.findUnique({
      //   where: {
      //     email: email,
      //   },
      // });
      // if (!user) {
      //   return res.status(404).json({ message: "User not found" });
      // }
      const validOtp = await verifyOtp({ email, otp });
      if (!validOtp) {
        throw Error("Invalid OTP");
      }
      const salt = bcrypt.genSaltSync(10);
      const updatedPassword = bcrypt.hashSync(newPassword, salt);
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: { password: updatedPassword },
      });
      const { password, ...userData } = updatedUser;
      res.status(200).json({
        user: userData,
        passwordUpdated: true,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default AuthController;

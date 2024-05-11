import prisma from "../config/db.config.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({ region: bucketRegion });

class UserController {
  static async getUser(req, res) {
    try {
      if (!req.user || !req.user.email) {
        return res.status(404).json({ message: "Email not found" });
      }

      const email = req.user.email;
      const user = await prisma.user.findUnique({
        where: { email: email },
        select: { email: true, firstName: true, imageName: true ,lastName: true ,imageUrl: true ,createdAt:true, updatedAt: true},
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const getObjectParams = {
        Bucket: bucketName,
        Key: user.imageName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 1800 });
      user.imageUrl = url;

      res.json(user);
    } catch (error) {
      console.log("Error fetching user", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      if (!req.user || !req.user.email) {
        return res.status(404).json({ message: "Email not found" });
      }
      const email = req.user.email;
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updateData = { ...req.body };
      delete updateData.password;
      console.log(updateData);
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: updateData,
      });

      res.json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      if (!req.user || !req.user.email) {
        return res.status(404).json({ message: "Email not found" });
      }
      const email = req.user.email;
      const newPassword = req.body.password;
      if (!newPassword) {
        return res.status(400).json({ message: "New password required" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashNewPassword = bcrypt.hashSync(newPassword, salt);

      const updatedUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: { password: hashNewPassword },
      });
      res.json({ user: updatedUser });
    } catch (err) {
      console.log("Error login", err);
      res.status(500).json({ message: error.message });
    }
  }

  static async handleImage(req, res) {
    try {
      if (!req.user || !req.user.email) {
        return res.status(400).json({ message: "Email not found" });
      }

      if (!req.file) {
        return res.status(404).json({ message: "No image file provided" });
      }

      const email = req.user.email;
      const fileBuffer = req.file.buffer;
      const buffer = await sharp(fileBuffer)
        .resize({ height: 500, width: 500, fit: "contain" })
        .toBuffer();
      const imageName = randomImageName();
      const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));

      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: { imageName: imageName },
        select: { email: true, firstName: true, imageName: true }, // Specify only the fields you want to include
      });

      res.json({ user: updatedUser, message: "Image uploaded successfully" });
    } catch (err) {
      console.log("Error handling image upload", err);
      res.status(500).json({ message: err.message });
    }
  }
}

export default UserController;

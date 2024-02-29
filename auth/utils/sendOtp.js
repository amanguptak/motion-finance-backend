import prisma from "../config/db.config.js";
import { sendEmail } from "./sendEmail.js";
import bcrypt from "bcrypt";

export const generateOtp = () => {
  try {
    return `${Math.floor(1000 + Math.random() * 9000)}`;
  } catch (err) {
    throw err;
  }
};

export const sendOtp = async ({ email, subject, message, duration = 1 }) => {
  try {
    if (!(email, subject, message)) {
      throw Error("Provide Email and Subject");
    }

    //  Delete existing OTP records for the provided email
    await prisma.otp.deleteMany({
      where: {
        email: email,
      },
    });

    const generatedOtp = await generateOtp();
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject,
      html: `
            <div style="font-family: Arial, sans-serif;">
              <h2 style="color: #385b64;">${subject}</h2>
              <p>${message}</p>
              <p style="color: #fe4f5a; font-weight: bold; font-size:20px;">Your One-Time Password (OTP): ${generatedOtp}</b></p>
              <p>This OTP will expires in ${duration} hour(s)</p>

            </div>
          `,
    };
    await sendEmail(mailOptions);
    const salt = bcrypt.genSaltSync(10);
    const hashedOtp = bcrypt.hashSync(generatedOtp, salt);
    const newOtp = await prisma.otp.create({
      data: {
        email: email,
        otp: hashedOtp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 600000), // Example: Expires in 1 hr
      },
    });
    return newOtp;
  } catch (err) {
    console.log("[SEND OTP]", err);
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    if (!(email && otp)) {
      throw Error("Please provide required details");
    }

    const matchOtp = await prisma.otp.findUnique({
      where: { email: email },
    });
    if (!matchOtp) {
      throw new Error("OTP not found");
    }

    const { expiresAt } = matchOtp;

    if (expiresAt < Date.now()) {
      await prisma.otp.deleteMany({
        where: {
          email: email,
        },
      });
      throw Error("Otp expired , Request for new one");
    }
    const validOtp = bcrypt.compareSync(otp, matchOtp.otp);
    if (!validOtp) {
      {
        throw Error("Invalid OTP");
      }
    }
    return validOtp;
  } catch (err) {
    throw Error(err);
  }
};

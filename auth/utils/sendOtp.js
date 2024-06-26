import prisma from "../config/db.config.js";
import { sendEmail } from "./sendEmail.js";
import {randomInt} from "crypto"
import bcrypt from "bcrypt";

export const generateOtp = () => {
  try {
    const generatedOtp = randomInt(1000, 10000);
 
    return generatedOtp;
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

    const generatedOtp = await generateOtp().toString();
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
    const {otp , ...data} = newOtp;
    return data;
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


export const deleteOtp = async(email)=>{
    try{
      
      const deletedOtp = await prisma.otp.deleteMany({
        where: {
          email: email, // Specify the email address associated with the OTP
        },
      });
    }catch (err) {
      throw Error(err);
    }
}

import prisma from "../config/db.config.js";
import { sendEmail } from "./sendEmail.js";
export const generateOtp = ()=>{
    try{
        return (otp = `${Math.floor(1000+Math.random()*9000)}`)
    }catch(err){
        throw err;
    }
}

export const sendOtp = async({email , subject , message , duration=1}) =>{
    try{
        if(!(email,subject,message)){
            throw Error("Provide Email and Subject")
        }

         // Delete existing OTP records for the provided email
        // await prisma.otp.deleteMany({
        //     where: {
        //       email: email,
        //     },
        //   });

       const generatedOtp =  await generateOtp();
          const mailOptions = {
            from : process.env.ADMIN_EMAIL,
            to:email,
            subject,
            html:`
            <div style="font-family: Arial, sans-serif;">
              <h2 style="color: #007bff;">${subject}</h2>
              <p>${message}</p>
              <p style="color: red; font-weight: bold;">Your One-Time Password (OTP): ${generatedOtp}</b></p>
              <p>This OTP will expires in ${duration} hour(s)</p>

            </div>
          `
          }
          await sendEmail(mailOptions)

          const newOtp =   await prisma.otp.create({
            data: {
              email: email,
              otp: generatedOtp,
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + 600000), // Example: Expires in 1 minute
            },
          });
          return newOtp
    }catch(err){
        console.log ("[SEND OTP]",(err))
    }
}
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log("[SEND EMAIL TRANSPORTER]",err);
  } else {
    console.log("Ready For Sending Mail");
    console.log(success);
  }
});

export const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("[SEND EMAIL TRANSPORTER MAIL OPTIONS]",err);
    throw err;
  }
};

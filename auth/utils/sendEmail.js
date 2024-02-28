import nodemailer from "nodemailer"

let transporter = nodemailer.createTransport({
    host : "smtp-mail.outlook.com",
    auth:{
        user: process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_PASSWORD,
    }
})

transporter.verify((err,success)=>{
    if(err){
        console.log(err)
    }else{
console.log("Ready for sending")
console.log(success)
    }
})


export const sendEmail = async(mailOptions)=>{
    try{
        await transporter.sendMail(mailOptions)
    }catch(err){
            console.log(err)
            throw err
    }
}
import prisma from "../config/db.config.js";
import bcrypt from "bcrypt";
// class UserController{
//     static async getUser(req,res){
//        try{
//         console.log("Check-this",req.user)
//         const email = req.user.email
//         if(!email){
//             res.status(404).json({message:"Email not found"})
//         }
//         const user = await  prisma.user.findUnique({
//             where: {email: email}
//         })
//         if(!user){
//             res.status(404).json({message:"User not found"})
//         }

//         res.json({user:user})
//        }catch(err){
//         console.log("Error login", err);
//         res.status(500).json({ message: "Something went wrong" });
//        }
//     }
// }
class UserController {
    static async getUser(req, res) {
      try {

        if (!req.user || !req.user.email) {
          return res.status(404).json({ message: "Email not found" });
        }
  
        const email = req.user.email;
        const user = await prisma.user.findUnique({
          where: { email: email }
        });
  
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        res.json(user);
      } catch (err) {
        console.log("Error login", err);
        res.status(500).json({ message: error.message});
      }
    }




    static async updateUser(req,res){
      try{
        if (!req.user || !req.user.email) {
          return res.status(404).json({ message: "Email not found" });
        }
        const email = req.user.email;
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      const updateData = {...req.body}
      delete updateData.password; 
      console.log(updateData)
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: updateData
    });

      res.json({ user: updatedUser });

      }catch(error){
        res.status(500).json({ message: error.message});
      }
    }


    static async changePassword(req,res){

      try{
        if (!req.user || !req.user.email) {
          return res.status(404).json({ message: "Email not found" });
        }
        const email = req.user.email;
        const newPassword = req.body.password;
        if (!newPassword) {
          return res.status(400).json({ message: "New password required" });
        }
      
        const salt = bcrypt.genSaltSync(10);
        const  hashNewPassword = bcrypt.hashSync(newPassword, salt);
        
        const updatedUser = await prisma.user.update({
          where: {
            email: email,
          },
          data: { password: hashNewPassword }
        })
        res.json({ user: updatedUser });

      }catch(err){
        console.log("Error login", err);
        res.status(500).json({ message: error.message});
      }


    }
  }
  

export default UserController
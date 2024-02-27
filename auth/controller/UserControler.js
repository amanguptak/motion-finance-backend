import prisma from "../config/db.config.js";

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
  
        res.json({ user: user });
      } catch (err) {
        console.log("Error login", err);
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  }
  

export default UserController
import prisma from "../config/db.config.js";

class UserController{
    static async getUser(req,res){
       try{
        const {email} = req.cookies.user
        if(!email){
            res.status(404).json({message:"Email not found"})
        }
        const user = await  prisma.user.findUnique({
            where: {email: email}
        })
        if(!user){
            res.status(404).json({message:"User not found"})
        }

        res.json({user:user})
       }catch(err){
        console.log("Error login", err);
        res.status(500).json({ message: "Something went wrong" });
       }
    }
}

export default UserController
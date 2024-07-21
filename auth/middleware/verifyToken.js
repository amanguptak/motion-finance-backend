// import jwt from "jsonwebtoken";
// import prisma from "../config/db.config.js";
// export const verifyToken = async (req, res, next) => {
//   try {
//     const token = req.cookies.authToken;
//     if (!token) {
//       res.status(401).json({ message: "Unauthorized" });
//     }
//     jwt.verify(token,process.env.SECRET_KEY,async(err, decodedToken)=>{
//       if (err) {
//         return res.status(403).json({ message: "Access Denied Please Login" });
//       }
//       req.user = await prisma.user.findUnique({
//         where: { email: decodedToken.user.email }
//       });

//       next()
//     })

//     // const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

//     // req.user = await prisma.user.findUnique({
//     //   where: { email: decodedToken.user.email },
//     // });
//     // next();
//   } catch (err) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

import jwt from "jsonwebtoken";
import prisma from "../config/db.config.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Access Denied. Please Login" });
      }
      console.log(decodedToken,"check token");
      // Ensure decodedToken contains email
      if (!decodedToken.user.email) {
        return res.status(403).json({ message: "Invalid token data" });
      }
 

      const user = await prisma.user.findUnique({
        where: { email: decodedToken.user.email }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


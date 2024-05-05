import jwt from "jsonwebtoken";
import prisma from "../config/db.config.js";
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token,process.env.SECRET_KEY,async(err, decodedToken)=>{
      if (err) {
        return res.status(403).json({ message: "Access Denied Please Login" });
      }
      req.user = await prisma.user.findUnique({
        where: { email: decodedToken.user.email }
      });

      next()
    })

    // const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // req.user = await prisma.user.findUnique({
    //   where: { email: decodedToken.user.email },
    // });
    // next();
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

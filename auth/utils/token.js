import jwt from "jsonwebtoken";
function generateToken(user){
 return jwt.sign({user},process.env.SECRET_KEY,{ expiresIn: '1h' })
}

export function sendToken(req,res,user ,statusCode){
    const token = generateToken(user);
    req.session.token=token;
    // res.status(201).send({...user , token: token});
    res.status(statusCode).send(user)
}

export function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, authData) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.authData = authData;
        next();
    });


}

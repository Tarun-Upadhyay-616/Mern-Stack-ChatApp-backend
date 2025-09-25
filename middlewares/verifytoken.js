import jwt from "jsonwebtoken";
export const verifytoken = async (req,res,next) =>{
    const token = req.cookies.jwt
    if(!token) return res.status(401).send("You are not authorized")
    jwt.verify(token,process.env.JWT_KEY , async(err,payload)=>{
        if(err) return res.status(403).send("Token is not Valid")
        req.userId = payload.id
        next()
    })
}
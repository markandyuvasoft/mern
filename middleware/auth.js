import  Jwt  from "jsonwebtoken"
import User from "../models/user.js"

const auth = async (req,res,next) => {

    try {
    // const token= req.headers.authorization.split(" ")[1]   //postman check ke ley
   
const token= req.cookies.jwtoken   // cookie check ke ley

   const verifytoken= Jwt.verify(token,process.env.SECRET_KEY)   //token ko verify krwya

    const rootuser= await User.findOne({_id:verifytoken._id, "tokens.token":token})

    if(!rootuser){
        res.send("user not found")
    }

    req.token = token
    req.rootuser = rootuser
    req.userID= rootuser._id

    next()

    } catch (error) {
    
        res.status(401).send("unauthorized no token provide")
    }

}

export default auth
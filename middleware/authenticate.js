const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const { sendError } = require('../utils/helper');

const authenticate = async(req,res,next) => {
    try {
        // console.log(req.body)
        const cookies = req.body.cookie;
        // console.log("Cookies: ",cookies);
        // console.log("Headers: ",req.body);
        if(!cookies){
            return res.status(401).json({error:"token not found!"});
        }
        const cookie= cookies.substring(cookies.indexOf('=')+1);

        // console.log(cookie);
        const token= cookie;
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        
        // console.log("Token : ",verifyToken);
        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token});
        if(!rootUser) return sendError(res,"User not found",404)

        req.token= token;
        req.rootUser= rootUser;
        req.userID= rootUser._id;
        next();
        
    } catch (error) {
        res.status(401).json({error:"Unauthorized: No token provided"})
        console.log(error);
    }
}
module.exports = authenticate;

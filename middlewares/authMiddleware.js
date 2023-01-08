const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticationMiddleware = async(req,res,next)=>{
    const token = req.cookies.TaskManagerToken;
    try {
        const decode = jwt.verify(token,process.env.SECRET);
        const{id} = decode;
        req.user = {id};
        next();
        
    }
    catch (error) {
      throw new Error("Not Authorized to access the route",401)
   }
    
}

module.exports = authenticationMiddleware;
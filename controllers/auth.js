const userModel = require('../models/user');
const sendGrid = require('@sendgrid/mail');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const loginPost = async(req,res)=>{
try {
    let token;
    const {email,password} = req.body;
    const user = await userModel.find({email:email});
   
    if(user.length){
        const isMatch = await bcrypt.compare(password,user[0].password);
        console.log(isMatch)
        if(isMatch){
            try {
                const userId= mongoose.Types.ObjectId(user[0]._id);
                token =  jwt.sign({id:userId},process.env.SECRET);
               user[0].tokens = user[0].tokens.concat({token:token});
                await user[0].save();
            } catch (error) {
               console.log(error);
               return error;
            }
            res.cookie('TaskManagerToken',token);
            return res.status(201).json({msg:"Login Success",user:user[0]._id});
        }else{
            
            return res.status(401).json({msg:"Incorrect Password..!"});
        }
    }
    else{
        return res.status(404).json({msg:"User Not Found..! Try Signing Up..!"});
    }
    
} catch (error) {
    return res.status(404).json({msg:"User Not Found..!"});
}
}
const editProfileGet = async(req,res) =>{
    try{
        const {id:userId} = req.params;
        const user = await userModel.find({_id:userId});
        if(user){
            return res.status(201).json({msg:"User Found..!",user:user[0]});
            
        }
        else{
        return res.status(404).json({msg:"User Not Found...!"});
    }
}
catch(err){
    return res.status(500).json({msg:err});
}
}
const editProfileUpdate = async(req,res) =>{
    try {
        const {id:userId} = req.params;
        const {name,username,email} = req.body;
        let user;
        try{
            const profileImage = req.file.path;
            user = await userModel.findOneAndUpdate({_id:userId},{name,email,username,profileImage},{
                new:true,runValidators:true
            });
        }
        catch(error){
            user = await userModel.findOneAndUpdate({_id:userId},{name,email,username},{
                new:true,runValidators:true
            });
        }
        return res.status(200).json({user:user});
    } catch (error) {
        return res.status(404).json({msg:error});
        
    }
}
const registerPost = async(req,res)=>{
    const {email,password,username,name} = req.body;
    let token;
    try {
        const userExists = await userModel.find({email:email,username:username});
        if(userExists.length > 1){
            return res.status(401).json({msg:"User Exists Please Try Logging In..!"});
        }
        else{
            try {
                try {
                    const profileImage = req.file.path;
                    const hashedPassword = await bcrypt.hash(password,16);
                    const user = await userModel.create({email,username,name,password:hashedPassword,profileImage});
                    try {
                        token =  jwt.sign({id:user._id},process.env.SECRET);
                       user.tokens = user.tokens.concat({token:token});
                        await user.save();
                    } catch (error) {
                       console.log(error);
                       return error;
                    }

                    res.cookie('TaskManagerToken',token);
                    return res.status(201).json({msg:"User Created..!",user:user});
                    
                } catch (error) {
                    const hashedPassword = await bcrypt.hash(password,16);
                    const user = await userModel.create({email,username,name,password:hashedPassword});
                    try {
                        token =  jwt.sign({id:user._id},process.env.SECRET);
                       user.tokens = user.tokens.concat({token:token});
                        await user.save();
                    } catch (error) {
                       console.log(error);
                       return error;
                    }
                 
                    res.cookie('TaskManagerToken',token);
                    return res.status(201).json({msg:"User Created..!",user:user});
                }
            } catch (error) {
                return res.status(500).json({msg:error})
            }
            
        }
        
    } catch (error) {
        return res.status(402).json({msg:"something went wrong"});
    }  
}
const verifyToken = async(req,res)=>{
    try {
        const {token} = req.body;
        const decode = jwt.verify(token,process.env.SECRET);
        const{id} = decode;
        const userId= mongoose.Types.ObjectId(id);
        const user =  await userModel.find({_id:userId}); 
        return res.status(200).json({user:user[0]});
    } catch (error) {
        return res.status(404).json({msg:error})
    }

}
const logout = (req,res)=>{
    console.log(req.cookies.TaskManagerToken);
    res.clearCookie("TaskManagerToken");
    return res.status(200).json({msg:"Here is deleted token",token:req.cookies.TaskManagerToken})

}
const forgotPasswordHandler = async(req,res) =>{
    try {
        const {email} = req.body;
        const user = await userModel.find({email:email});
        if(user){
            const secret = process.env.SECRET + user[0].password;
            const payload = {
                id:user[0]._id,
            };
             const token = jwt.sign(payload,secret,{expiresIn:'10m'});
             const link = `http://localhost:5000/api/v1/auth/reset-password/${user[0]._id}/${token}`;
             try {
                sendGrid.setApiKey(process.env.API_KEY);
            const message = {
                to:email,
                from:{
                    name:"Krishna Chaitanya from Task Manager, ",
                    email:'krishnawyvern@gmail.com'
                },
                subject:`Hello ${user[0].name}, Hope you are having a good day..!`,
                html:`<p style="text-align:centre;font-weight:400">We received a password change request for your Task Manager Account, by clicking the link below you will be redirected to a magic where you can change your password. The link will get expired in next 10 minutes so be quick 😉..!</p><br><a href=${link} style="text-align:center;display:block;color:purple" > Click Here For Magic Link 🚀 </a>` 
            }
            const response = await sendGrid.send(message);
            return res.status(201).json({msg:"Mail Sent Successfully..!"});
             } catch (error) {
                console.log(error.response.body);
             }
            
        }
        else{
            return res.status(404).json({msg:"User Not Found"});
        }
    } catch (error) {
        return res.status(500).json({msg:"error from server side..!"});
    }
  
}
const getResetPassoword = async(req,res)=>{
    const pathToFile = path.join(__dirname + "/../public" + "/reset-password.html");
    res.sendFile(pathToFile);
}
const postResetPassword = async(req,res)=>{

 try {
    const {token,userID,password} = req.body;
    const decode = await jwt.decode(token);
     const {id} = decode;
    const userId= mongoose.Types.ObjectId(id);
        const hashedPassword = await bcrypt.hash(password,16);
        const updatedUser = await userModel.findOneAndUpdate({_id:userId},{password:hashedPassword},{new:true});
        return res.status(201).json({msg:"Password Changed Successfully",user:updatedUser}); 
 } catch (error) {
    return res.status(500).json({msg:" User Doesn't Exist With The Id Provided or Server is facing some issues at this moment "});
 }

};
module.exports = {
    loginPost,registerPost,verifyToken,editProfileGet,editProfileUpdate,forgotPasswordHandler,logout,getResetPassoword,postResetPassword
}
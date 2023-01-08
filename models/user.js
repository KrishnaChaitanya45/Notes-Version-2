const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userSchema = new mongoose.Schema({
   email:{
    type:String,
   },
   joinedOn:{
    type:Date,
    default:Date.now
   },
   password:{
    type:String,
    min:8,
    max:15
   },
   username:{
    type:String,
    unique:true
   },
   name:{
    type:String,
    min:6,
    max:20
   },
   tasks:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Task'
   },
   profileImage:{

   type:String,
   default:"https://randomuser.me/api/portraits/women/82.jpg"
   },
   tokens:[
      {
         token:{
         type:String
      }
   }
   ]
});
userSchema.methods.generateAuthToken = async function(){
   try {
      const token =  jwt.sign({id:this._id},process.env.SECRET);
      this.tokens = this.tokens.concat({token:token});
      await this.save();
      return token;
   } catch (error) {
      console.log(error);
      return error;
   }

}
module.exports = mongoose.model('User',userSchema);
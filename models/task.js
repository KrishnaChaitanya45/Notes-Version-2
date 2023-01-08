const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
   createdAt:{
    type:Date,
    default:Date.now().toString()
   },
   title:{
    type:String,
  
   },
   tag:{
    type:String,
   
   },
   description:{
    type:String,
  
   },
   completed:{
      type:Boolean,
      default:false
   },
   createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
   },
   offlineId:{
      type:Number,
      default:0
   }
   
  
});

const Task = mongoose.model('Task',taskSchema);
Task.createCollection().then(function(collection) {
  });
  module.exports = Task;
const taskModel = require("../models/task");
const userModel = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const { query } = require("express");
// const redis = require('redis');
// const util = require('util');
// const client = redis.createClient();
// client.connect().then(()=>{

// })
// async function connectToClient(){
//     await client.connect();

//     console.log("Connected")

// }
// client.get = util.promisify(client.get);
// client.set = util.promisify(client.set);
// connectToClient();

require("dotenv").config();
const getAllTasks = async (req, res) => {
  const { tag, search } = req.query;
  // console.log(req.query)
  try {
    const token = req.cookies.TaskManagerToken;
    const decode = jwt.verify(token, process.env.SECRET);
    const { id } = decode;
    const userId = mongoose.Types.ObjectId(id);
    const user = await userModel.find({ _id: userId });
    const queryObject = { createdBy: user[0]._id };
    // console.log("fine untill here");
    if (tag == "all") {
      const alltasks = await taskModel.find({createdBy: user[0]._id });
      const tags = [];
      alltasks.forEach(task=>{
        const {tag} = task;
        if(!tags.includes(tag)){
          tags.push(tag);

        }
      });
      return res.status(200).json({tags:tags})
    }
    else{
      // console.log("fine here")
      if(tag){
        queryObject.tag = tag;

      }
      // console.log(queryObject);
    if (search) {
      queryObject.title = search;
    }
    console.log(queryObject);
    try {
      const tasks = await taskModel.find(queryObject);
      return res.status(200).json({ tasks: tasks, user: user[0] });
    } catch (error) {
   
      return res
      .status(404)
      .json({ msg: "No Tasks found from the user specified" });
    }
    }
  

    //get all tags
    //tag wise sorting
    //search a task
  } catch (error) {
    return res.status(500).json({ msg: "Error from server" });
  }
};
const UpdateTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const token = req.cookies.TaskManagerToken;
    const decode = jwt.verify(token, process.env.SECRET);
    const { id } = decode;
    const userId = mongoose.Types.ObjectId(id);
    const user = await userModel.find({ _id: userId });
    const task = await taskModel.findOneAndUpdate(
      { _id: taskId, createdBy: user[0]._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({ task });
  } catch (error) {
    return res.status(404).json({ msg: "Task not found..!" });
  }
};
const getASingleTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const token = req.cookies.TaskManagerToken;
    const decode = jwt.verify(token, process.env.SECRET);
    const { id } = decode;
    const userId = mongoose.Types.ObjectId(id);
    // if(client.get(userId)){
    //     const idForRedis =id.toString();
    //     const task = await client.get(idForRedis);
    //     return res.status(201).json({task});
    // }else{
    const user = await userModel.find({ _id: userId });
    const task = await taskModel.find({ _id: taskId, createdBy: user[0]._id });
    return res.status(201).json({ task });
    // }
  } catch (error) {
    // await client.set('random','itworks');
    // const value = await get('random');
    return res
      .status(404)
      .json({ msg: "The Task your looking for is not found..!" });
  }
};
const deleteATask = async (req, res) => {
  try {
    const token = req.cookies.TaskManagerToken;
    const decode = jwt.verify(token, process.env.SECRET);
    const { id } = decode;
    const userId = mongoose.Types.ObjectId(id);
    const user = await userModel.find({ _id: userId });
    const { id: taskId } = req.params;
    const task = await taskModel.findOneAndDelete({
      _id: taskId,
      createdBy: user[0]._id,
    });
    return res.status(200).send();
  } catch (error) {
    return res.status(404).json({ msg: "Task not found..!" });
  }
};
const createTask = async (req, res) => {
  const token = req.cookies.TaskManagerToken;
  const decode = jwt.verify(token, process.env.SECRET);
  const { id } = decode;
  const userId = mongoose.Types.ObjectId(id);
  try {
    const user = await userModel.find({ _id: userId });
    const { title, description, tag } = req.body;
    // const user = req.user;
    const body = {
      title: title,
      description: description,
      tag: tag,
      createdBy: user[0]._id,
    };
    const task = await taskModel.create(body);
    // const idForRedis = user[0]._id.toString();
    // const response = await client.set(idForRedis,JSON.stringify(body));
    return res.status(201).json({ task: task, user: user[0]._id });
  } catch (error) {
    return res.status(402).json({ msg: error });
  }
};

const uploadOfflineTasks = async (req, res) => {
  try {
    const task = req.body;
    const userId = mongoose.Types.ObjectId(task.createdBy);
    const user = await userModel.find({ _id: userId });
    // console.log(title);
    if (user) {
      const task = req.body;
      const { title, description, tag, id, completed } = task;
      const body = {
        title: title,
        description: description,
        tag: tag,
        createdBy: user[0]._id,
        offlineId: id,
        completed: completed,
      };
      const uploadedtask = await taskModel.create(body);
      return res
        .status(201)
        .json({
          msg: `Task ${title.substring(7)} is uploaded to database..`,
          task: uploadedtask,
        });
    } else {
      return res
        .status(404)
        .json({ msg: `No your found with the userId ${userId}` });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        msg: `Server Error, sorry for the inconvenience we'll fix this soon..! `,
        error: error,
      });
  }
};

module.exports = {
  getAllTasks,
  UpdateTask,
  getASingleTask,
  deleteATask,
  createTask,
  uploadOfflineTasks,
};

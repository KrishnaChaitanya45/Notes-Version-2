const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const userModel = require('./models/user');
const port = process.env.PORT || 5000;
require('dotenv').config();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const multer = require('multer');
const authRoute = require('./routes/auth');
const taskRoute = require('./routes/task');
const connectToDatabase = require('./db/connectToDatabase');
const  mongoose  = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'uploads' );// we should create the  folder for uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,  uniqueSuffix+'-' + file.originalname)
  }
}); 
app.use(cookieParser());
app.use(multer({ storage: storage }).single('image'));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));


app.use('/uploads',express.static(path.resolve(__dirname, 'uploads')));
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/tasks',taskRoute);
const start= async()=>{
try {
     await connectToDatabase(process.env.MONGO_URI_USERS);
      console.log("Connected to Database..!");
    app.listen(5000);
  } catch (error) {
    console.log("working offline..!");
  app.listen(5000);
}
}
start();
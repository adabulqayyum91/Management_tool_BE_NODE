const env = require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Required Routes
const authRoutes = require('./Routes/Auth');
const passwordRoutes = require('./Routes/Password');
const firmRoutes = require('./Routes/Firm');
const staffRoutes = require('./Routes/Staff');
const clientRoutes = require('./Routes/Client');
const profileRoutes = require('./Routes/Profile');
const dashboardRoutes = require('./Routes/Dashboard');
const imageRoutes = require('./Routes/Image');
const manageFieldRoutes = require('./Routes/ManageField');
const designationRoutes = require('./Routes/Designation');
const projectRoutes = require('./Routes/Project');
const projectTypeRoutes = require('./Routes/ProjectType');
const projectUserRoutes = require('./Routes/ProjectUser');
const projectStatusRoutes = require('./Routes/ProjectStatus');
const userRoutes = require('./Routes/User');
const taskRoutes = require('./Routes/Task');
const fileRoutes = require('./Routes/File');
const commentRoutes = require('./Routes/Comment');
const userActivityRoutes = require('./Routes/UserActivity');
const threadRoutes = require('./Routes/Thread');
const messageRoutes = require('./Routes/Message');
const customFieldRoutes = require('./Routes/CustomField');
const featureToggle = require('./Routes/FeatureToggle');



const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/sample';

// Connect Mongo DB
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
  if (!err) {
    console.log('Connection Successful');
  } else {
    console.log('Connection not successful', err);
  }
});
mongoose.Promise = global.Promise;


// Middlewears 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(morgan("dev"));
app.use('/Uploads', express.static('Uploads'));
app.use('/Assets', express.static('Assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Routes which should handle requests
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/firm", firmRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/manage-field", manageFieldRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/designation", designationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/project-status", projectStatusRoutes);
app.use("/api/project-type", projectTypeRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/project-user", projectUserRoutes);
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/user-activity", userActivityRoutes);
app.use("/api/thread", threadRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/custom-field", customFieldRoutes);
app.use("/api/feature-toggle", featureToggle);



// Default Route When nothing matches
app.use((req, res, next) => {
  const error = new Error("Not found :o :o");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");

exports.allUsers = async (req, res) => {
  const users = await User.find();
  console.log(users)
  if (users.length === 0) {
    return res.status(404).json({
      success: true,
      message: "Users is empty",
    });
  }
  res.status(201).json(users);
};

exports.userTask = async (req,res) => {
  const {userId} = req.params;
  console.log(userId)
  const userData = await User.findById(userId).populate('tasks');
  const task = userData.tasks
  console.log(task,"task")
  if (!userData) {
  return  res.status(404).json({
      success: false,
      message: "User not found the specified id",
    });
  } 
    res.status(201).json(task);
  
}
exports.editUser = async (req, res) => {
  const {userId}  = req.params
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const updateUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });
  res.status(201).json(updateUser);
}

exports.deleteUser = async (req,res) => {
    const {userId} = req.params
    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ message: "Task not found" });
      }
    
      await user.deleteOne();
      res.json({ message: "Task deleted" });
}

exports.viewAllTasks = async (req, res) => {
  const tasks = await Task.find()

  if (!tasks) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(tasks);
};

exports.viewTaskById = async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json(task);
           
};

exports.editTask = async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
    new: true,
  });
  res.status(201).json(updatedTask);
};


exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};



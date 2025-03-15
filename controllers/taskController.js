const express = require("express");
const Task = require("../models/Task");
const User = require('../models/User')

exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority,status } = req.body;

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    user: req.user.id,
  });


  await User.findByIdAndUpdate(
    req.user.id, 
    { $push: { tasks: task._id } }, 
    { new: true }
  );

  res.status(201).json(task);
};

//get their created tasks

exports.viewOwnTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });

  if (!tasks) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(tasks);
};

exports.viewTaskById = async (req, res) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json(task);

};

exports.editTask = async (req, res) => {
  const taskId  = req.params.id;

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
  const taskId  = req.params.id;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};

exports.updateStatus = async  (req,res) => {
  const taskId  = req.params.id;
  const {status} = req.body
  const task = await Task.findById(taskId);
  if (status === task.status){
  
  }
}

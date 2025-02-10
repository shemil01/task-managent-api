const express = require("express");
const bcrypt = require("bcryptjs");    
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body)

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All feilds are required" });
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return res
      .status(400)
      .json({ success: false, message: "User with same email already exist" });
  }

  const hashPassword = await bcrypt.hash(String(password), 10);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(201).json({ message: "User registered successfully",user,token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).send("Please fill all fields");
  }

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(
    String(password),
    isUserExist.password
  );
  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: "Incorrect password",
    });
  }

  const token = jwt.sign({ id: isUserExist._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({
    userData:isUserExist,
    token,
    message: "Login successfull",
  });
};

exports.viewProfile = async (req,res) => {
  const userId = req.user.id
  const user = await User.findById(userId)

  res.json(user)
}




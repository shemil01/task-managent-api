const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body);

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

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCES_TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.cookie("refreshToken", refreshToken);

  res
    .status(201)
    .json({ message: "User registered successfully", user, accessToken });
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

  const accessToken = jwt.sign(
    { id: isUserExist._id },
    process.env.ACCES_TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );
  const refreshToken = jwt.sign(
    { id: isUserExist._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.cookie("refreshToken", refreshToken);

  res.status(200).json({
    userData: isUserExist,
    token,
    message: "Login successfull",
  });
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).send("Login your account");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "invalid refresh token" });
    } else {
      const accessToken = jwt.sign(
        { id: decoded._id },
        process.env.ACCES_TOKEN_SECRET,
        {
          expiresIn: "2h",
        }
      );
      return res
      .cookie("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),  
      })
      .send("Refresh token generated");
    }
  });
};

exports.viewProfile = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  res.json(user);
};

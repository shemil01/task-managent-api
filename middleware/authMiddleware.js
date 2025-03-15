const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }
    return res.redirect("/api/refresh_token");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCES_TOKEN_SECRET);
    req.user = decoded;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

const adminMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  const user = await User.findById(req.user.id);
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };

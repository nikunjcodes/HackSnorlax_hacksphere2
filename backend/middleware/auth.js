const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      logger.warn("Authentication failed: No token provided");
      return res.status(401).json({ error: "Please authenticate." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        logger.warn("Authentication failed: User not found", {
          userId: decoded.userId,
        });
        return res.status(401).json({ error: "Please authenticate." });
      }

      logger.info("User authenticated successfully", {
        userId: user._id,
        role: user.role,
      });

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      logger.error("Token verification failed:", { error: error.message });
      return res.status(401).json({ error: "Please authenticate." });
    }
  } catch (error) {
    logger.error("Authentication middleware error:", { error: error.message });
    res.status(500).json({ error: "Server error during authentication." });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      logger.warn("Admin access denied", {
        userId: req.user._id,
        role: req.user.role,
      });
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    logger.info("Admin access granted", { userId: req.user._id });
    next();
  } catch (error) {
    logger.error("Admin middleware error:", { error: error.message });
    res.status(500).json({ error: "Server error during admin verification." });
  }
};

const isInstructor = async (req, res, next) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      logger.warn("Instructor access denied", {
        userId: req.user._id,
        role: req.user.role,
      });
      return res
        .status(403)
        .json({ error: "Access denied. Instructor privileges required." });
    }

    logger.info("Instructor access granted", { userId: req.user._id });
    next();
  } catch (error) {
    logger.error("Instructor middleware error:", { error: error.message });
    res
      .status(500)
      .json({ error: "Server error during instructor verification." });
  }
};

module.exports = { auth, isAdmin, isInstructor };

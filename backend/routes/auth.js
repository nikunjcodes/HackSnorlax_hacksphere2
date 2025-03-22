const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");

const router = express.Router();

// Validation middleware
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("institution").trim().notEmpty().withMessage("Institution is required"),
  body("role").isIn(["student", "instructor"]).withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Register user
router.post("/register", registerValidation, async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Registration validation failed", { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role, institution, specialization } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("Registration failed: Email already exists", {
        email: req.body.email,
      });
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role,
      institution,
      specialization,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    logger.info("User registered successfully", { userId: user._id });
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    logger.error("Registration error:", { error: error.message });
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login user
router.post("/login", loginValidation, async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Login validation failed", { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Login failed: User not found", { email: req.body.email });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn("Login failed: Invalid password", { email: req.body.email });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    logger.info("User logged in successfully", { userId: user._id });
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ user: userResponse, token });
  } catch (error) {
    logger.error("Login error:", { error: error.message });
    res.status(500).json({ error: "Error logging in" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user: user.toJSON() });
  } catch (error) {
    logger.error("Get user error:", { error: error.message });
    res.status(500).json({ error: "Error fetching user data" });
  }
});

// Update user profile
router.patch("/profile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "institution", "specialization"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    const userResponse = req.user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change password
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout route
router.post("/logout", auth, (req, res) => {
  try {
    logger.info("User logged out successfully", { userId: req.user._id });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error:", { error: error.message });
    res.status(500).json({ error: "Error logging out" });
  }
});

// Get user statistics
router.get("/stats", auth, async (req, res) => {
  try {
    logger.info("Fetching user statistics", { userId: req.user._id });

    // Get user's courses count
    const coursesEnrolled = req.user.enrolledCourses
      ? req.user.enrolledCourses.length
      : 0;
    const completedCourses = req.user.completedCourses
      ? req.user.completedCourses.length
      : 0;

    // Get user's lab hours (you'll need to implement this based on your lab sessions model)
    const labHours = req.user.labHours || 0;

    // Get experiments count
    const totalExperiments = req.user.experiments
      ? req.user.experiments.length
      : 0;
    const completedExperiments = req.user.experiments
      ? req.user.experiments.filter((exp) => exp.status === "completed").length
      : 0;

    // Get achievements
    const achievements = req.user.achievements
      ? req.user.achievements.length
      : 0;
    const newAchievements = req.user.achievements
      ? req.user.achievements.filter((a) => {
          const achievementDate = new Date(a.dateEarned);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return achievementDate > oneMonthAgo;
        }).length
      : 0;

    const stats = {
      coursesEnrolled,
      completedCourses,
      labHours,
      totalExperiments,
      completedExperiments,
      achievements,
      newAchievements,
      lastActive: req.user.lastActive || new Date(),
      name: req.user.name,
    };

    logger.info("User statistics fetched successfully", {
      userId: req.user._id,
    });
    res.json(stats);
  } catch (error) {
    logger.error("Error fetching user statistics:", { error: error.message });
    res.status(500).json({ error: "Error fetching user statistics" });
  }
});

// Update user points
router.post("/points/update", auth, async (req, res) => {
  try {
    const { points, category } = req.body;

    await req.user.addPoints(points, category);

    // Update user ranks
    const users = await User.find().sort({ "points.total": -1 });
    for (let i = 0; i < users.length; i++) {
      users[i].rank = i + 1;
      await users[i].save();
    }

    logger.info("Points updated successfully", {
      userId: req.user._id,
      points,
      category,
    });

    res.json({
      points: req.user.points,
      rank: req.user.rank,
    });
  } catch (error) {
    logger.error("Error updating points:", { error: error.message });
    res.status(500).json({ error: "Error updating points" });
  }
});

// Get leaderboard
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const {
      category = "total",
      timeframe = "total",
      limit = 10,
      page = 1,
    } = req.query;
    const skip = (page - 1) * limit;

    let sortField = `points.${timeframe}`;
    if (category !== "total") {
      sortField = `points.categoryPoints.${category}`;
    }

    const users = await User.find()
      .select("name institution points rank avatar specialization")
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    logger.error("Error fetching leaderboard:", { error: error.message });
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

module.exports = router;

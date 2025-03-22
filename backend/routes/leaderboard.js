const express = require("express");
const Leaderboard = require("../models/Leaderboard");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// Get global leaderboard with user details
router.get("/global", auth, async (req, res) => {
  try {
    const { category = "Overall", timeframe = "all" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let sortField = "points.total";
    if (timeframe === "weekly") sortField = "points.weekly";
    if (timeframe === "monthly") sortField = "points.monthly";

    // Fetch users with their points, sorted by the specified timeframe
    const users = await User.find({})
      .select("name institution specialization avatar points achievements")
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalUsers = await User.countDocuments();

    // Get current user's rank
    const userRank =
      (await User.countDocuments({
        [sortField]: { $gt: req.user.points[timeframe] || 0 },
      })) + 1;

    // Format response
    const formattedUsers = users.map((user, index) => ({
      _id: user._id,
      name: user.name,
      institution: user.institution,
      specialization: user.specialization,
      avatar: user.avatar,
      rank: skip + index + 1,
      points: {
        total: user.points.total,
        weekly: user.points.weekly,
        monthly: user.points.monthly,
        categoryPoints: user.points.categoryPoints,
      },
      achievements: user.achievements,
    }));

    logger.info("Leaderboard fetched successfully", {
      category,
      timeframe,
      userId: req.user._id,
    });

    res.json({
      users: formattedUsers,
      userRank,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    logger.error("Error fetching leaderboard:", { error: error.message });
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

// Get institution leaderboard
router.get("/institution", auth, async (req, res) => {
  try {
    const { timeframe = "all" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let sortField = "points.total";
    if (timeframe === "weekly") sortField = "points.weekly";
    if (timeframe === "monthly") sortField = "points.monthly";

    // Fetch users from the same institution
    const users = await User.find({ institution: req.user.institution })
      .select("name institution specialization avatar points achievements")
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalInstitutionUsers = await User.countDocuments({
      institution: req.user.institution,
    });

    // Get user's institution rank
    const userInstitutionRank =
      (await User.countDocuments({
        institution: req.user.institution,
        [sortField]: { $gt: req.user.points[timeframe] || 0 },
      })) + 1;

    // Format response
    const formattedUsers = users.map((user, index) => ({
      _id: user._id,
      name: user.name,
      institution: user.institution,
      specialization: user.specialization,
      avatar: user.avatar,
      rank: skip + index + 1,
      points: {
        total: user.points.total,
        weekly: user.points.weekly,
        monthly: user.points.monthly,
        categoryPoints: user.points.categoryPoints,
      },
      achievements: user.achievements,
    }));

    res.json({
      users: formattedUsers,
      userInstitutionRank,
      currentPage: page,
      totalPages: Math.ceil(totalInstitutionUsers / limit),
      totalUsers: totalInstitutionUsers,
    });
  } catch (error) {
    logger.error("Error fetching institution leaderboard:", {
      error: error.message,
    });
    res.status(500).json({ error: "Error fetching institution leaderboard" });
  }
});

// Update user points
router.post("/update-points", auth, async (req, res) => {
  try {
    const { points, category = "Overall", achievementType } = req.body;

    // Update user's points
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update points
    user.points.total += points;
    user.points.weekly += points;
    user.points.monthly += points;

    // Update category points if specified
    if (category !== "Overall") {
      const categoryKey = category.toLowerCase().replace(/\s+/g, "");
      if (user.points.categoryPoints.hasOwnProperty(categoryKey)) {
        user.points.categoryPoints[categoryKey] += points;
      }
    }

    // Add achievement if provided
    if (
      achievementType &&
      !user.achievements.some((a) => a.type === achievementType)
    ) {
      user.achievements.push({
        title: achievementType,
        description: `Earned ${achievementType} achievement`,
        type: achievementType,
      });
    }

    await user.save();

    logger.info("Points updated successfully", {
      userId: req.user._id,
      points,
      category,
    });

    res.json(user);
  } catch (error) {
    logger.error("Error updating points:", { error: error.message });
    res.status(500).json({ error: "Error updating points" });
  }
});

// Reset weekly points (should be called by a cron job)
router.post("/reset-weekly", auth, async (req, res) => {
  try {
    await User.updateMany({}, { $set: { "points.weekly": 0 } });
    logger.info("Weekly points reset successfully");
    res.json({ message: "Weekly points reset successfully" });
  } catch (error) {
    logger.error("Error resetting weekly points:", { error: error.message });
    res.status(500).json({ error: "Error resetting weekly points" });
  }
});

// Reset monthly points (should be called by a cron job)
router.post("/reset-monthly", auth, async (req, res) => {
  try {
    await User.updateMany({}, { $set: { "points.monthly": 0 } });
    logger.info("Monthly points reset successfully");
    res.json({ message: "Monthly points reset successfully" });
  } catch (error) {
    logger.error("Error resetting monthly points:", { error: error.message });
    res.status(500).json({ error: "Error resetting monthly points" });
  }
});

module.exports = router;

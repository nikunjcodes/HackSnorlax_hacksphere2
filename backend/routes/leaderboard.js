const express = require("express");
const Leaderboard = require("../models/Leaderboard");
const { auth } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// Get global leaderboard
router.get("/global", auth, async (req, res) => {
  try {
    const { category = "Overall", timeframe = "all" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let sortField = "points";
    if (timeframe === "weekly") sortField = "weeklyPoints";
    if (timeframe === "monthly") sortField = "monthlyPoints";

    const leaderboard = await Leaderboard.find({ category })
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name institution avatar");

    // Get user's rank
    const userRank =
      (await Leaderboard.countDocuments({
        category,
        [sortField]: { $gt: req.user.leaderboard?.[sortField] || 0 },
      })) + 1;

    logger.info("Leaderboard fetched successfully", {
      category,
      timeframe,
      userId: req.user._id,
    });

    res.json({
      leaderboard,
      userRank,
      currentPage: page,
      totalPages: Math.ceil(
        (await Leaderboard.countDocuments({ category })) / limit
      ),
    });
  } catch (error) {
    logger.error("Error fetching leaderboard:", { error: error.message });
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

// Get institution leaderboard
router.get("/institution", auth, async (req, res) => {
  try {
    const { category = "Overall", timeframe = "all" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let sortField = "points";
    if (timeframe === "weekly") sortField = "weeklyPoints";
    if (timeframe === "monthly") sortField = "monthlyPoints";

    const leaderboard = await Leaderboard.find({
      category,
      institution: req.user.institution,
    })
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name avatar");

    // Get user's institution rank
    const userInstitutionRank =
      (await Leaderboard.countDocuments({
        category,
        institution: req.user.institution,
        [sortField]: { $gt: req.user.leaderboard?.[sortField] || 0 },
      })) + 1;

    res.json({
      leaderboard,
      userInstitutionRank,
      currentPage: page,
      totalPages: Math.ceil(
        (await Leaderboard.countDocuments({
          category,
          institution: req.user.institution,
        })) / limit
      ),
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

    let leaderboard = await Leaderboard.findOne({
      userId: req.user._id,
      category,
    });

    if (!leaderboard) {
      leaderboard = new Leaderboard({
        userId: req.user._id,
        category,
        institution: req.user.institution,
      });
    }

    // Update points
    leaderboard.points += points;
    leaderboard.weeklyPoints += points;
    leaderboard.monthlyPoints += points;
    leaderboard.lastUpdated = new Date();

    // Add achievement if provided
    if (
      achievementType &&
      !leaderboard.achievements.includes(achievementType)
    ) {
      leaderboard.achievements.push(achievementType);
    }

    await leaderboard.save();

    // Update ranks for all users in this category
    await updateRanks(category);

    logger.info("Points updated successfully", {
      userId: req.user._id,
      points,
      category,
    });

    res.json(leaderboard);
  } catch (error) {
    logger.error("Error updating points:", { error: error.message });
    res.status(500).json({ error: "Error updating points" });
  }
});

// Helper function to update ranks
async function updateRanks(category) {
  const leaderboards = await Leaderboard.find({ category }).sort({
    points: -1,
  });

  for (let i = 0; i < leaderboards.length; i++) {
    leaderboards[i].rank = i + 1;
    await leaderboards[i].save();
  }
}

// Reset weekly points (should be called by a cron job)
router.post("/reset-weekly", auth, async (req, res) => {
  try {
    await Leaderboard.updateMany({}, { $set: { weeklyPoints: 0 } });
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
    await Leaderboard.updateMany({}, { $set: { monthlyPoints: 0 } });
    logger.info("Monthly points reset successfully");
    res.json({ message: "Monthly points reset successfully" });
  } catch (error) {
    logger.error("Error resetting monthly points:", { error: error.message });
    res.status(500).json({ error: "Error resetting monthly points" });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
    },
    weeklyPoints: {
      type: Number,
      default: 0,
    },
    monthlyPoints: {
      type: Number,
      default: 0,
    },
    achievements: [
      {
        type: String,
        enum: [
          "Physics Champion",
          "Chemistry Wizard",
          "Biology Master",
          "Data Science Expert",
          "Lab Expert",
          "Quick Learner",
        ],
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ["Physics", "Chemistry", "Biology", "Computer Science", "Overall"],
      default: "Overall",
    },
    institution: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying
leaderboardSchema.index({ points: -1, category: 1, institution: 1 });

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
module.exports = Leaderboard;

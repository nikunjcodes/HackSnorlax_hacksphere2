const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Physics", "Chemistry", "Biology", "Computer Science"],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  experiments: [
    {
      title: String,
      description: String,
      duration: Number, // in minutes
      equipment: [String],
      procedure: [String],
      expectedResults: String,
    },
  ],
  prerequisites: [
    {
      type: String,
    },
  ],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
labSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Lab = mongoose.model("Lab", labSchema);
module.exports = Lab;

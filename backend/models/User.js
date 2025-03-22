const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    institution: {
      type: String,
      required: [true, "Institution is required"],
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    enrolledCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
        },
      },
    ],
    completedCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    experiments: [
      {
        experimentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Experiment",
        },
        status: {
          type: String,
          enum: ["in_progress", "completed", "failed"],
          default: "in_progress",
        },
        startedAt: {
          type: Date,
          default: Date.now,
        },
        completedAt: Date,
      },
    ],
    labHours: {
      type: Number,
      default: 0,
    },
    achievements: [
      {
        title: String,
        description: String,
        dateEarned: {
          type: Date,
          default: Date.now,
        },
        type: {
          type: String,
          enum: ["course", "experiment", "participation", "excellence"],
        },
      },
    ],
    lastActive: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    points: {
      total: {
        type: Number,
        default: 0,
      },
      weekly: {
        type: Number,
        default: 0,
      },
      monthly: {
        type: Number,
        default: 0,
      },
      categoryPoints: {
        physics: { type: Number, default: 0 },
        chemistry: { type: Number, default: 0 },
        biology: { type: Number, default: 0 },
        computerScience: { type: Number, default: 0 },
      },
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new Error("Error hashing password"));
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  try {
    const token = jwt.sign(
      { userId: this._id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return token;
  } catch (error) {
    throw new Error("Error generating auth token");
  }
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Add a method to update points
userSchema.methods.addPoints = async function (amount, category = null) {
  this.points.total += amount;
  this.points.weekly += amount;
  this.points.monthly += amount;

  if (category) {
    const categoryKey = category.replace(/\s+/g, "").toLowerCase();
    if (this.points.categoryPoints.hasOwnProperty(categoryKey)) {
      this.points.categoryPoints[categoryKey] += amount;
    }
  }

  await this.save();
};

const User = mongoose.model("User", userSchema);
module.exports = User;

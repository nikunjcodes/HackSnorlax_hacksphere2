const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
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
  duration: {
    type: Number, // in weeks
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  modules: [
    {
      title: String,
      description: String,
      labs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lab",
        },
      ],
      resources: [
        {
          title: String,
          type: String,
          url: String,
        },
      ],
    },
  ],
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  prerequisites: [
    {
      type: String,
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
courseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

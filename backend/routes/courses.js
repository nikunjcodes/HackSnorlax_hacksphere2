const express = require("express");
const Course = require("../models/Course");
const { auth, isInstructor } = require("../middleware/auth");

const router = express.Router();

// Get all courses (with filters)
router.get("/", auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    // Filter by category
    if (req.query.category) {
      match.category = req.query.category;
    }

    // Filter by difficulty
    if (req.query.difficulty) {
      match.difficulty = req.query.difficulty;
    }

    // Search by title
    if (req.query.search) {
      match.title = { $regex: req.query.search, $options: "i" };
    }

    // Sort by field
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    const courses = await Course.find(match)
      .sort(sort)
      .populate("instructor", "name email")
      .populate("enrolledStudents", "name email")
      .populate("modules.labs", "title description");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("enrolledStudents", "name email")
      .populate("modules.labs", "title description");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new course
router.post("/", auth, isInstructor, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user._id,
    });

    await course.save();
    await course.populate("instructor", "name email");

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update course
router.patch("/:id", auth, isInstructor, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "description",
    "category",
    "difficulty",
    "duration",
    "modules",
    "prerequisites",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user._id,
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    updates.forEach((update) => (course[update] = req.body[update]));
    await course.save();
    await course.populate("instructor", "name email");
    await course.populate("enrolledStudents", "name email");
    await course.populate("modules.labs", "title description");

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete course
router.delete("/:id", auth, isInstructor, async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      instructor: req.user._id,
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in course
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();
    await course.populate("instructor", "name email");
    await course.populate("enrolledStudents", "name email");
    await course.populate("modules.labs", "title description");

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unenroll from course
router.post("/:id/unenroll", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const index = course.enrolledStudents.indexOf(req.user._id);
    if (index === -1) {
      return res.status(400).json({ error: "Not enrolled in this course" });
    }

    course.enrolledStudents.splice(index, 1);
    await course.save();
    await course.populate("instructor", "name email");
    await course.populate("enrolledStudents", "name email");
    await course.populate("modules.labs", "title description");

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

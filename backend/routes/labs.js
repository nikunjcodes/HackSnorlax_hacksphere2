const express = require("express");
const Lab = require("../models/Lab");
const { auth, isInstructor } = require("../middleware/auth");

const router = express.Router();

// Get all labs (with filters)
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

    const labs = await Lab.find(match)
      .sort(sort)
      .populate("instructor", "name email")
      .populate("assignedUsers", "name email");

    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lab by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("assignedUsers", "name email");

    if (!lab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    res.json(lab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new lab
router.post("/", auth, isInstructor, async (req, res) => {
  try {
    const lab = new Lab({
      ...req.body,
      instructor: req.user._id,
    });

    await lab.save();
    await lab.populate("instructor", "name email");

    res.status(201).json(lab);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update lab
router.patch("/:id", auth, isInstructor, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "description",
    "category",
    "difficulty",
    "experiments",
    "prerequisites",
    "assignedUsers",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    const lab = await Lab.findOne({
      _id: req.params.id,
      instructor: req.user._id,
    });

    if (!lab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    updates.forEach((update) => (lab[update] = req.body[update]));
    await lab.save();
    await lab.populate("instructor", "name email");
    await lab.populate("assignedUsers", "name email");

    res.json(lab);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete lab
router.delete("/:id", auth, isInstructor, async (req, res) => {
  try {
    const lab = await Lab.findOneAndDelete({
      _id: req.params.id,
      instructor: req.user._id,
    });

    if (!lab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    res.json(lab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign users to lab
router.post("/:id/assign", auth, isInstructor, async (req, res) => {
  try {
    const lab = await Lab.findOne({
      _id: req.params.id,
      instructor: req.user._id,
    });

    if (!lab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    const { userIds } = req.body;
    lab.assignedUsers = [...new Set([...lab.assignedUsers, ...userIds])];

    await lab.save();
    await lab.populate("instructor", "name email");
    await lab.populate("assignedUsers", "name email");

    res.json(lab);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove users from lab
router.post("/:id/unassign", auth, isInstructor, async (req, res) => {
  try {
    const lab = await Lab.findOne({
      _id: req.params.id,
      instructor: req.user._id,
    });

    if (!lab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    const { userIds } = req.body;
    lab.assignedUsers = lab.assignedUsers.filter(
      (id) => !userIds.includes(id.toString())
    );

    await lab.save();
    await lab.populate("instructor", "name email");
    await lab.populate("assignedUsers", "name email");

    res.json(lab);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

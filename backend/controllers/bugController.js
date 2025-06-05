// POST /api/bugs
const createBug = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      project,
      assignedTo,
      createdBy,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const bug = new Bug({
      title,
      description,
      priority,
      status,
      project,
      assignedTo,
      createdBy,
    });

    const savedBug = await bug.save();
    res.status(201).json(savedBug);
  } catch (error) {
    console.error("Error creating bug:", error);
    res.status(500).json({ message: "Error creating bug", error: error.message });
  }
};

const express = require("express");
const router = express.Router();
const BlogsModel = require("../model/Blogs.model");

// Getting all blogs
router.get("/", async (req, res) => {
  try {
    const allCategories = await BlogsModel.find();
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    console.log(categoryId);
    const allCategories = await BlogsModel.find({ categoryId: categoryId });
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Creating new blog
router.post("/", async (req, res) => {
  const blogDetails = new BlogsModel({
    heading: req.body.heading,
    description: req.body.description,
    content: req.body.content,
    categoryId: req.body.categoryId,
    userId: req.body.userId,
  });
  try {
    const blog = await BlogsModel.findOne({ heading: req.body.heading });
    if (blog) {
      return res.status(404).json({ error: "blog already added" });
    }
    const addBlog = await blogDetails.save();
    res.status(201).json(addBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one categories
router.patch("/:id", async (req, res) => {
  const itemId = req.params.id;
  const updateData = req.body;
  try {
    const updateditem = await BlogsModel.findByIdAndUpdate(
      { _id: itemId },
      updateData,
      { new: true }
    );
    if (!updateditem) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ updateditem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete Blog Item
router.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await BlogsModel.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.json({ message: "Item deleted successfully", deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

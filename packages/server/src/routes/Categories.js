const express = require("express");
const CategoriesModel = require("../model/Categories.model");
const router = express.Router();

const getDataById = async (req, res, next) => {
  let data;
  try {
    data = await CategoriesModel.findById(req.params.id);
    if (data === null) {
      return res.status(404).json({ message: "Cannot find record" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.CategoriesModel = data;
  next();
};

// Getting all categories
router.get("/", async (req, res) => {
  try {
    const allCategories = await CategoriesModel.find();
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting one categories
router.get("/:id", getDataById, (req, res) => {
  try {
    res.json(res.CategoriesModel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Creating New categories
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const category = await CategoriesModel.findOne({
      name: name.toLowerCase(),
    });
    if (category) {
      return res.status(208).json({ error: "Category already added" });
    }
    const categoriesDetails = new CategoriesModel({
      name: name,
    });
    const addCategor = await categoriesDetails.save();
    res.status(201).json(addCategor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one categories
router.patch("/:id", async (req, res) => {
  const itemId = req.params.id;
  const { updateData } = req.body;

  try {
    const category = await CategoriesModel.findOne({
      name: req.body.name,
    });
    if (category) {
      return res.status(404).json({
        error: "Category already remining please change the category name",
      });
    }

    const updateditem = await CategoriesModel.findByIdAndUpdate(
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

// Delete categories
router.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await CategoriesModel.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.json({ message: "Item deleted successfully", deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

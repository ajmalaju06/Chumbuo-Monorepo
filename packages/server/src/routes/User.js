const express = require("express");
const UserModel = require("../model/User.model");
const router = express.Router();

const getDataById = async (req, res, next) => {
  let data;
  try {
    data = await UserModel.findById(req.params.id);
    if (data === null) {
      return res.status(404).json({ message: "Cannot find record" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.UserModel = data;
  next();
};

// Getting all registered Users
router.get("/", async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting one User
router.get("/:id", getDataById, (req, res) => {
  try {
    res.json(res.UserModel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting one user
router.get("/:id", getDataById, (req, res) => {
  try {
    res.json(res.UserModel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Creating New categories
router.post("/", async (req, res) => {
  const userDetails = new UserModel({
    emailId: req.body.emailId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    mobileNumber: req.body.mobileNumber,
    passowrd: req.body.password,
  });
  try {
    const user = await UserModel.findOne({ emailId: req.body.emailId });
    if (user) {
      return res.status(404).json({ error: "User already added" });
    }
    const addUser = await userDetails.save();
    res.status(201).json(addUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one categories
router.patch("/:id", async (req, res) => {
  const itemId = req.params.id;
  const updateData = req.body;
  try {
    const updateditem = await UserModel.findByIdAndUpdate(
      { _id: itemId },
      updateData,
      { new: true }
    );
    if (!updateditem) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ updateditem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await UserModel.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User deleted successfully", deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

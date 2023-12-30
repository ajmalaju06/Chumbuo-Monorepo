const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Blogs", blogsSchema);

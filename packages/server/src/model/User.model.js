const mongoose = require("mongoose");

const RegistationSchema = new mongoose.Schema({
  emailId: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  dateOfBirth: {
    type: String,
    require: true,
  },
  mobileNumber: {
    type: String,
    require: true,
  },
  passowrd: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Registration", RegistationSchema);

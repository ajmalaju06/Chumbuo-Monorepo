const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserModel = require("../model/User.model");

router.post("/", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await UserModel.findOne({ emailId: emailId });

    if (!user) {
      return res.status(404).json({ error: "User not registered" });
    }

    if (user.emailId === emailId && user.passowrd === password) {
      const tokenUser = { emailId: user.emailId, id: user._id };
      const accessToken = jwt.sign(
        tokenUser,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );
      res.json({ accessToken: accessToken });
    } else {
      return res
        .status(404)
        .json({ error: "Username and password not matching" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;

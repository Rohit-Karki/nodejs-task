const express = require("express");
const router = express.Router();
const User = require("../db/user.registerModel");
const { verifyUsersPostandAdmin } = require("./verify");
const { JsonWebTokenError: jwt } = require("jsonwebtoken");

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    const token = jwt.sign({ userId: user._id }, "secret-key", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } else {
    next(new Error("Couldn't find user"));
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../db/user.registerModel");
const { verifyUsersPostandAdmin } = require("./verify");
router.post("/register", async (req, res) => {
  let role = req.body.role;
  role ??= "viewer";
  await User.create({ ...req.body, role });
  return res.json({ success: true });
});

module.exports = router;

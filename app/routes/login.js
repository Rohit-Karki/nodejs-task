const express = require("express");
const router = express.Router();
const User = require("../db/user.registerModel");
const { verifyUsersPostandAdmin } = require("../middlewares/verify");
const { JsonWebTokenError: jwt } = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email address
 *         password:
 *           type: string
 *           description: Password
 *       example:
 *         email: roj@example.com
 *         password: rojj
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Login User
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: id
 *         schema:
 *           type: Integer
 *         required: true
 *         description: The Post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The LoggedIn user and JWT token post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    const token = jwt.sign({ userId: user._id }, "secret-key", {
      expiresIn: "1h",
    });
    res.status(200).json({ user, token });
  } else {
    next(new Error("Couldn't find user"));
  }
});

module.exports = router;

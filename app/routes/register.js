const express = require("express");
const router = express.Router();
const User = require("../db/user.registerModel");
const { verifyUsersPostandAdmin } = require("../middlewares/verify");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Eamil address
 *         password:
 *           type: string
 *           description: Password
 *         role:
 *           type: string
 *           enum: ["admin", "viewer"]
 *           description: Role of the user

 *       example:
 *         email: admin@gmail.com
 *         password: admin
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Register User
 * /register:
 *   post:
 *     summary: Register a User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The registered user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

router.post("/", async (req, res) => {
  let role = req.body.role;
  role ??= "viewer";
  const user = await User.create({ ...req.body, role });
  return res.json({ user });
});

module.exports = router;

const express = require("express");
const {
  verifyEditorandPost,
  verifyPostId,
  verifyUsersPostandAdmin,
  verifyPostOnlyAfterTime,
  verifyUserPostandEditor,
  verifyTimePeriod,
  verifyLoggedInUser,
} = require("../middlewares/verify");
const Post = require("../db/postsModel");
const { default: mongoose } = require("mongoose");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - id
 *         - content
 *         - ownerId
 *       properties:
 *         id:
 *           type: string
 *           description: Id must be greater than 10000
 *         tags:
 *           type: array
 *           description: array of tag
 *         content:
 *           type: string
 *           description: The title of your Post
 *         ownerId:
 *           type: ObjectId
 *           description: The post author ID
 *         editors:
 *           type: array
 *           description: array of editors
 *       example:
 *         id: 1200000
 *         content: Alexander K. Dewdney
 *         ownerId: 1000029b
 *         tags: ["yellow","mellow"]
 *         editors: ["9089hks","89218hfjs"]
 */

router.get("/:id", verifyPostId, async (req, res) => {
  const id = req.params.id;
  try {
    if (id == null) {
      throw new Error("Invlaid params");
    } else if (id != null && id != undefined) {
      const product = await Product.findById(id);
      res.status(200).json(product);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     PaginatedPost:
 *       type: object
 *       required:
 *         - posts
 *         - totalPages
 *         - currentPage
 *         - previousPage
 *         - nextPage
 *       properties:
 *         posts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Post'
 *           description: Post object
 *         totalPages:
 *           type: number
 *           description: total pages
 *         currentPage:
 *           type: integer
 *           description: Current Page Index
 *         previousPage:
 *           type: integer
 *           description: Previous Page Index
 *         nextPage:
 *           type: integer
 *           description: Next page Index
 *       example:
 *         posts: {
 *           "id":1200000,
 *           "content":"Alexander K. Dewdney",
 *           "ownerId":"1000029b",
 *           "tags":["yellow","mellow"],
 *           "editors":["9089hks","89218hfjs"]
 *                }
 *         totalPages: 10
 *         currentPage: 2
 *         previousPage: 1
 *         nextPage: 3
 */
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts managing API
 * /posts:
 *   get:
 *     summary: Get all post with paginated responses
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: All the posts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPost'
 */
// For all posts
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const posts = await Post.find({})
    // We multiply the "limit" variables by one just to make sure we pass a number and not a string
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  // We sort the data by the date of their creation in descending order (user 1 instead of -1 to get ascending order)
  // .sort({ createdAt: -1 });
  // Getting the numbers of products stored in database
  const count = await Post.countDocuments();

  return res.status(200).json({
    posts,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    previousPage: page - 1 > 0 ? page - 1 : page,
    nextPage: page + 1 < Math.ceil(count / limit) ? page + 1 : page,
  });
});

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts managing API
 * /posts/{id}:
 *   get:
 *     summary: Get a post with the specified id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: Integer
 *         required: true
 *         description: The Post id
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 *   post:
 *     summary: Create a new Post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: Integer
 *         required: true
 *         description: The Post id
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: String
 *         required: true
 *         description: JWT Token User Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 *
 */
// Upload a new posts
router.post(
  "/:id",
  verifyLoggedInUser,
  verifyPostOnlyAfterTime,
  verifyPostId,
  async (req, res) => {
    const id = Number(req.params?.id);
    const ownerId = req.userId;
    const post = {
      ...req.body,
      id: id,
      ownerId: new mongoose.Types.ObjectId(ownerId),
    };

    const updatedPost = await Post.create(post);
    return res.status(200).json(updatedPost);
  }
);

// Edit the post
router.put(
  "/:id",
  verifyLoggedInUser,
  verifyUserPostandEditor,
  async (req, res) => {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Tags:
 *       type: object
 *       required:
 *         - tags
 *       properties:
 *         tag:
 *           type: array
 *           description: New tags
 *       example:
 *         ["yeeloow", "mwllow"]
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts managing API
 * /posts/addTags/{id}:
 *   put:
 *     summary: Add new tags to a Post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
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
 *             $ref: '#/components/schemas/Tags'
 *     responses:
 *       200:
 *         description: The edited post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */

// Add Tags
router.put(
  "/addTags/:id",
  verifyLoggedInUser,
  verifyUserPostandEditor,
  verifyTimePeriod,
  async (req, res) => {
    const { id } = req.params;
    const { tags } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, {
      $push: { tags: tags },
    });
    return res.status(201).json(updatedPost);
  }
);

router.delete(
  "/:id",
  verifyLoggedInUser,
  verifyUsersPostandAdmin,
  async (req, res) => {
    const { userId } = req.body;
    const id = req.params.id;
    const { deletedPost } = await Post.delete({ id: id });
    return res.status(200).json({ success: true });
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Editors:
 *       type: object
 *       required:
 *         - editors
 *       properties:
 *         editors:
 *           type: array
 *           description: New editors of the post
 *       example:
 *         ["09030fb"]
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts managing API
 * /posts/assigneditors/{id}:
 *   put:
 *     summary: Assign editors to a Post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
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
 *             $ref: '#/components/schemas/Editors'
 *     responses:
 *       200:
 *         description: The edited post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 *
 */

// To assign the editors
router.put(
  "/assigneditors/:id",
  verifyLoggedInUser,
  verifyUsersPostandAdmin,
  async (req, res) => {
    const id = req.params?.id;
    const { editors } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, {
      $push: { editors: editors },
    });
    return res.status(201).json(updatedPost);
  }
);

module.exports = router;

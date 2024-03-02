const express = require("express");
const {
  verifyEditorandPost,
  verifyPostId,
  verifyUsersPostandAdmin,
  verifyPostOnlyAfterTime,
  verifyUserPostandEditor,
} = require("./verify");
const Post = require("../db/postsModel");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/:id", verifyPostId, async (req, res) => {
  console.log(req.params.id);
  const { id } = req.params.id;
  if (id == null) {
    throw new Error("Invlaid params");
  } else if (id != null && id != undefined) {
    const product = await Product.findById(id);
    console.log(product);
    console.log("end");
    res.status(200).json(product);
  }
});

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
  console.log(posts);
  // Getting the numbers of products stored in database
  const count = await Post.countDocuments();

  return res.status(200).json({
    posts,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    previousPage: page - 1 > 0 ? page - 1 : page,
    nextPage: page + 1 > totalPages ? page + 1 : page,
  });
});

// Upload a new posts
router.post(
  "/add",
  // verifyPostOnlyAfterTime,
  // verifyPostId,
  async (req, res) => {
    const { ownerId } = req.body;
    console.log(ownerId);
    const post = {
      ...req.body,
      ownerId: new mongoose.Types.ObjectId(ownerId),
    };

    const updatedPost = await Post.create(req.body);
    return res.status(200).json(updatedPost);
  }
);

// Edit the post
router.put("/:id", verifyUserPostandEditor, async (req, res) => {
  const { id } = req.params;
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(200).json(updatedPost);
});

// Add Tags
router.put("/addTags/:id", verifyUserPostandEditor, async (req, res) => {
  const { id } = req.params;
  const { tags } = req.body;
  const updatedPost = await Post.findByIdAndUpdate(id, {
    $push: { tags: tags },
  });
  return res.status(201).json(updatedPost);
});

router.delete("/:id", verifyUsersPostandAdmin, async (req, res) => {
  const { userId } = req.body;
  const id = req.params.id;
  const { deletedPost } = await Post.delete({ id: id });
  return res.status(200).json({ success: true });
});

// To assign the editors
router.put("/assigneditors/:id", verifyUsersPostandAdmin, async (req, res) => {
  const id = req.params?.id;
  const { editors } = req.body;
  const updatedPost = await Post.findByIdAndUpdate(id, {
    $push: { editors: editors },
  });
  return res.status(201).json(updatedPost);
});

module.exports = router;

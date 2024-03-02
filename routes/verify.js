const Post = require("../db/postsModel");
const User = require("../db/user.registerModel");

const verifyUsersPostandAdmin = async (req, _, next) => {
  const id = req.params?.id;
  const userId = req.body?.userId;
  try {
    const post = await Post.findById(id);
    const user = await User.findById(userId);
    console.log(user);
    console.log(post);
    if (post.ownerId == userId || user.role == "admin") {
      next();
    } else {
      throw Error("Unauthorized request");
    }
  } catch (error) {
    next(error);
  }
};

const verifyEditorandPost = async (req, res, next) => {
  const id = req.params?.id;
  const userId = req.body?.userId;
  try {
    const post = await Post.findById(id);
    if (post.editors.includes(userId)) {
      next();
    } else {
      throw Error("Unauthorized request");
    }
  } catch (error) {
    next(error);
  }
};

const verifyPostOnlyAfterTime = async (req, res, next) => {
  const now = new Date();
  try {
    const currentHour = now.getHours();
    if (currentHour < 5) {
      throw Error("Posting is only allowed after 5 am.");
    } else {
      // Continue to the next middleware or route handler
      next();
    }
  } catch (error) {
    next(error);
  }
};

const verifyPostId = (req, _, next) => {
  const { id } = req.params;
  try {
    if (id > 1000) {
      next();
    } else {
      throw Error("Post Id Error");
    }
  } catch (error) {
    next(error);
  }
};

const verifyUserPostandEditor = async (req, res, next) => {
  const id = req.params?.id;
  const userId = req.body?.userId;
  try {
    const user = await User.findById(userId);

    const post = await Post.findById(id);
    if (post.editors.includes(userId)) {
      next();
    } else if (post.ownerId != userId || user.role != "admin") {
      throw new Error("Unauthorized request");
    } else {
      next();
    }
  } catch (error) {
    console.log("err", error);
    next(error);
  }
};

module.exports = {
  verifyUsersPostandAdmin,
  verifyEditorandPost,
  verifyPostId,
  verifyPostOnlyAfterTime,
  verifyUserPostandEditor,
};

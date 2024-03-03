const Post = require("../db/postsModel");

const verifyLoggedInUser = (req, res, next) => {
  const token = req.headers("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};

const verifyUsersPostandAdmin = async (req, res, next) => {
  const id = req.params?.id;
  const userId = req?.userId;
  try {
    const post = await Post.findById(id);
    const user = await User.findById(userId);
    if (post.ownerId == userId || user.role == "admin") {
      req.abilities = defineAdminAbilities();
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
  const userId = req?.userId;
  try {
    const post = await Post.findById(id);
    if (post.editors.includes(userId)) {
      req.abilities = defineEditorAbilities();
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

const verifyPostId = (req, res, next) => {
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
  const userId = req?.userId;
  try {
    const user = await User.findById(userId);

    const post = await Post.findById(id);
    if (post.editors.includes(userId)) {
      req.abilities = defineEditorAbilities();
      next();
    } else if (post.ownerId != userId || user.role != "admin") {
      throw new Error("Unauthorized request");
    } else {
      req.abilities = defineAdminAbilities();
      next();
    }
  } catch (error) {
    console.log("err", error);
    next(error);
  }
};
// Can only edit the post upto 5 days of creation time
const verifyTimePeriod = async (req, res, next) => {
  const id = req.params?.id;
  let { createdAt } = await Post.findById(id);

  createdAt = new Date(createdAt);
  const futureDate = new Date(createdAt.setDate(createdAt.getDate() + 5));
  const currentDate = new Date();

  if (currentDate < futureDate) {
    next();
  } else {
    next(new Error("Edits can only happen Upto 5 days"));
  }
};

module.exports = {
  verifyUsersPostandAdmin,
  verifyEditorandPost,
  verifyPostId,
  verifyPostOnlyAfterTime,
  verifyUserPostandEditor,
  verifyTimePeriod,
  verifyLoggedInUser,
};

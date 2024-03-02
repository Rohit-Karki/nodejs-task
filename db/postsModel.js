const mongoose = require("mongoose");

const PostRegisterSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      require: true,
    },
  ],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  editors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

module.exports = mongoose.model("posts", PostRegisterSchema);

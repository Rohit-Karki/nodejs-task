const mongoose = require("mongoose");

const PostRegisterSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      min: 10000,
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", PostRegisterSchema);

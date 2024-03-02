require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const register = require("./routes/register");
const postsRouter = require("./routes/posts");
const registerRouter = require("./routes/register");
const usersRouter = require("./routes/users");

app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.db)
  .then(() => {
    console.log("successfully connected");
  })
  .catch((err) => {
    console.log(`error ${err}`);
  });

app.get("/", (req, res) => {
  res.send("app is running");
});

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  console.log("err", err);
  if (err.message === "Unauthorized Request") {
    return res.status(500).json("Unauthorized");
  } else if (err.message === "Posting is only allowed after 5 am.") {
    return res
      .status(403)
      .json({ error: "Posting is only allowed after 5 am." });
  } else {
    return res.status(403).json({ error: `${err}` });
  }
});
app.listen(process.env.PORT, () => {
  console.log(`app is running in port ${process.env.PORT}`);
});

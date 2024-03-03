require("dotenv").config();
const express = require("express"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const postsRouter = require("./routes/posts");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const { verifyLoggedInUser } = require("./middlewares/verify");

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

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/posts", postsRouter);

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

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Nodejs Task Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Rohit Raj Karki",
        email: "rohitkarki804@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.get("/", (req, res) => {
  res.send("ping pong");
});

app.listen(process.env.PORT, () => {
  console.log(`app is running in port ${process.env.PORT}`);
});

const express = require("express");
const { getTopics } = require("./controllers/topics_controller");
const { getAllEndpoints } = require("./controllers/api_controller");
const {
  getArticleById,
  getAllArticles,
  getArticleComments,
  updateArticle,
} = require("./controllers/article_controller");
const {
  postComment,
  deleteCommentById,
} = require("./controllers/comment_controller");
const {
  getAllUsers,
  getUserByUsername,
} = require("./controllers/users_controller");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/users", getAllUsers);

app.get("/api/users/:username", getUserByUsername);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticle);

app.delete("/api/comments/:comment_id", deleteCommentById);

////////////////////////////////// error handling below

//custom

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

// generic
app.use((err, req, res, next) => {
  const errorCode404 = ["23503"];
  const errorCode400 = ["22P02", "23502"];
  if (errorCode404.includes(err.code)) {
    res.status(404).send({ msg: "Not found" });
  }
  if (errorCode400.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

module.exports = app;

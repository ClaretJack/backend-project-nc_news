const express = require("express");
const { getTopics } = require("./controllers/topics_controller");
const { getAllEndpoints } = require("./controllers/api_controller");
const {
  getArticleById,
  getAllArticles,
  getArticleComments,
} = require("./controllers/article_controller");
const { postComment } = require("./controllers/comment_controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

////////////////////////////////// error handling below

//custom
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

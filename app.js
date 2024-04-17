const express = require("express");
const { getTopics } = require("./controllers/topics_controller");
const { getAllEndpoints } = require("./controllers/api_controller");
const {
  getArticleById,
  getAllArticles,
  getArticleComments,
} = require("./controllers/article_controller");

const app = express();
app.use(express.json());
1;
app.get("/api/topics", getTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
});

module.exports = app;

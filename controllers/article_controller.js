const {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleExists,
  updateArticleById,
} = require("../models/article_models");
const { checkTopicExists } = require("../models/topics_models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { topic, order, sort_by } = req.query;
  selectAllArticles(topic, order, sort_by)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    selectArticleComments(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const update = req.body;

  Promise.all([
    updateArticleById(article_id, update),
    checkArticleExists(article_id),
  ])
    .then(([[article]]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

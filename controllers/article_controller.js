const {
  selectArticleById,
  selectAllArticles,
} = require("../models/article_models");

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
  selectAllArticles().then((article) => {
    res.status(200).send(article);
  });
};

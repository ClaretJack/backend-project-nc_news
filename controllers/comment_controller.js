const { insertComment } = require("../models/comment_models");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  insertComment(article_id, newComment)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

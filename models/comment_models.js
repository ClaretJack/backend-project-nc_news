const db = require("../db/connection");

exports.insertComment = (article_id, addedComment) => {
  return db
    .query(
      `INSERT INTO comments
    (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`,
      [article_id, addedComment.username, addedComment.body]
    )
    .then(({ rows }) => {
      return rows;
    });
};

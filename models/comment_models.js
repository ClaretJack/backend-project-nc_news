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

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id =$1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};

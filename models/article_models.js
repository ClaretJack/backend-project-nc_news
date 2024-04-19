const db = require("../db/connection");
const { selectAllTopics } = require("./topics_models");

selectArticleById = (article_id) => {
  const SqlString = `
  SELECT 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.body, 
  articles.topic, 
  articles.created_at, 
  articles.votes, 
  article_img_url, 
  CAST(COUNT(comment_id) AS INT) 
  AS comment_count 
  FROM articles 
  LEFT JOIN comments 
  ON comments.article_id=articles.article_id`;

  const whereQuery = ` WHERE articles.article_id=$1`;
  const groupAndOrder = ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;

  return db
    .query(SqlString + whereQuery + groupAndOrder, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};

selectAllArticles = (topic) => {
  let sqlString = `
  SELECT articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      CAST(COUNT(comment_id) AS INT) 
      AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON comments.article_id = articles.article_id 
      `;

  const topicArray = [];
  if (topic) {
    sqlString += ` WHERE topic =$1`;
    topicArray.push(topic);
  }

  sqlString += ` GROUP BY articles.article_id 
  ORDER BY created_at DESC`;
  return db.query(sqlString, topicArray).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Topic does not exist" });
    }
    return rows;
  });
};
checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE articles.article_id=$1", [article_id])
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
    });
};

selectArticleComments = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE comments.article_id =$1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

updateArticleById = (article_id, update) => {
  const { inc_votes } = update;
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleExists,
  updateArticleById,
};

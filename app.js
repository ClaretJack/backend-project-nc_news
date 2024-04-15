const express = require("express");
const { getTopics } = require("./controllers/topics_controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  return res.status(404).send({ msg: "Not Found!" });
});

module.exports = app;

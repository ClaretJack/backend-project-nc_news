const express = require("express");
const { getTopics } = require("./controllers/topics_controller");
const { getAllEndpoints } = require("./controllers/api_controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getAllEndpoints);

module.exports = app;

const requestFile = require("../endpoints.json");
const fs = require("node:fs");

exports.getAllEndpoints = (req, res, next) => {
  fs.readFile("endpoints.json", "utf-8", (err, data) => {
    return res.status(200).send(data);
  });
};

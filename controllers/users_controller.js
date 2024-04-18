const { selectAllUsers } = require("../models/users_models.js");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

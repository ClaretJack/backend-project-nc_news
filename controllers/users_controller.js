const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users_models.js");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

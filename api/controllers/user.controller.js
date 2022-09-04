const userService = require("../services/user.service");

exports.login = (req, res, next) => {
  const { username, password } = req.body;
  console.log("ip address", req.ip);
  userService
    .login({ username, password })
    .then(({ ...user }) => {
      res.json(user);
    })
    .catch(next);
};

exports.register = (req, res, next) => {
  userService
    .register(req.body)
    .then(() =>
      res.json({
        message: "Registration successful",
      })
    )
    .catch(next);
};

exports.getAll = (req, res, next) => {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
};

exports.getById = (req, res, next) => {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
};

exports.update = (req, res, next) => {
  userService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
};

exports.deposit = (req, res, next) => {
  userService
    .deposit(req.user.id, req.body)
    .then((data) => res.json(data))
    .catch(next);
};

exports.reset = (req, res, next) => {
  userService
    .reset(req.user.id)
    .then((data) => res.json(data))
    .catch(next);
};

exports._delete = (req, res, next) => {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
};

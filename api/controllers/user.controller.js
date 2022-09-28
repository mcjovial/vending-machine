const userService = require("../services/user.service");

exports.login = (req, res, next) => {
  const { username, password } = req.body;
  userService
    .login({ username, password }, req)
    .then(({ ...user }) => {
      res.json(user);
    })
    .catch(next);
};

exports.logout = (req, res, next) => {
  userService
    .logout(req.user.id, req.user.token_id)
    .then(() =>
      res.status(201).json({message: "Logout successful"})
    )
    .catch(next);
};

exports.logoutAll = (req, res, next) => {
  userService
    .logoutAll(req.body)
    .then(() =>
      res.status(201).json({message: "You have successfully logged out from all devices"})
    )
    .catch(next);
};

exports.register = (req, res, next) => {
  userService
    .register(req)
    .then((data) =>
      res.status(201).json(data)
    )
    .catch(next);
};

exports.getAll = (req, res, next) => {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
};

exports.getInfo = (req, res, next) => {
  userService
    .getInfo(req.user.id)
    .then((data) => res.json(data))
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
    .update(req)
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

const userService = require("../services/user.service");


exports.login = (req, res, next) => {
  const { username, password } = req.body;
  console.log('ip address', req.ip);
  userService
    .login({ username, password })
    .then(({ ...user }) => {
      res.json(user);
    })
    .catch(next);
};

exports.register = (req, res, next) => {
  userService
    .register(req.body, req.get("origin"), res)
    .then(() =>
      res.json({
        message:
          "Registration successful",
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
  // users can get their own user and admins can get any user
  if (req.params.id !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
};

exports.update = (req, res, next) => {
  // users can update their own user and admins can update any user
  if (req.params.id !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
};

exports._delete = (req, res, next) => {
  // users can delete their own user and admins can delete any user
  if (req.params.id !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
};

const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const { findOneAndUpdate } = require("../models/user.model");
const User = require("../models/user.model");

module.exports = {
  login,
  register,
  getAll,
  getById,
  update,
  deposit,
  delete: _delete,
};

async function login({ username, password }) {
  const user = await User.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw "Usename or password is incorrect";
  }

  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
  };
}

async function register(params, origin) {
  // validate
  if (await User.findOne({ username: params.username })) {
    throw "Username is already registered!";
  }

  // create user object
  const user = new User(params);

  // hash password
  user.password = hash(params.password);

  // save user
  await user.save();

  return basicDetails(user);
}

async function getAll() {
  const users = await User.find();
  return users.map((x) => basicDetails(x));
}

async function getById(id) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function update(id, params) {
  const user = await getUser(id);
  // validate (if username was changed)
  if (params.username === user.username) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.password = hash(params.password);
  }

  const _new = await User.findOneAndUpdate({ _id: id }, params, { new: true });
  // copy params to account and save
  // Object.assign(user, params);
  // await user.save();

  return basicDetails(_new);
}

async function deposit(id, params) {
  const allowed_coins = [5, 10, 20, 50, 100];
  if (!allowed_coins.includes(params.deposit)) {
    throw `Deposit can only be 5,10,20,50,100`;
  }
  return await User.findOneAndUpdate({ _id: id }, params, { new: true });
}

async function _delete(id) {
  const user = await getUser(id);
  await user.remove();
}

// helper functions

async function getUser(id) {
  if (!db.isValidId(id)) throw "User not found";
  const user = await User.findById(id);
  if (!user) throw "User not found";
  return user;
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function generateJwtToken(user) {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: user.id, id: user.id }, config.secret, {
    expiresIn: "45m",
  });
}

function basicDetails(user) {
  const { id, username, deposit, role } = user;
  return { id, username, deposit, role };
}

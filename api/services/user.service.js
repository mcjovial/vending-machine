const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const User = require("../models/user.model");
const { secret } = require("../_helpers/config");
const { createToken } = require("../_helpers/token");
const UserLogin = require("../models/user-login.model");
const BlacklistToken = require("../models/blacklist-token.model");

module.exports = {
  login,
  register,
  logout,
  logoutAll,
  getAll,
  getById,
  getInfo,
  update,
  deposit,
  delete: _delete,
  getUser,
  reset
};

async function login({ username, password }, req) {
  const user = await User.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw "Usename or password is incorrect";
  }

  const session = await UserLogin.findOne({ user_id: user.id, token_deleted: false })
  if (session) throw "There is already an active session using your account"

  // authentication successful so generate jwt and refresh tokens
  const token = await generateJwtToken(user, req);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    token,
  };
}

async function logoutAll(body) {
  const { username } = body
  const user = await User.findOne({ username })
  if (!user) throw "Invalid User name"

  const user_logins = await UserLogin.find({
    user_id: user.id,
    logged_out: false,
  });

  if (!user_logins) throw "You do not have an active session"
  user_logins.forEach(async (login) => {
    if (login) {
      login.logged_out = true;
      login.token_deleted = true;
      await login.save();
    }
  });
}

async function logout(userId, token_id) {
  const user_login = await UserLogin.findOne({
    user_id: userId,
    token_id,
    logged_out: false,
  });

  if (!user_login) throw "You do not have an active session"

  user_login.logged_out = true;
  user_login.token_deleted = true;
  await user_login.save();

  // blacklist the current token
  return await BlacklistToken.create({
    token: user_login.token,
  });
}

async function register(req) {
  const params = req.body
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

  // authentication successful so generate jwt and refresh tokens
  const token = await generateJwtToken(user, req);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    token,
  };
}

async function getAll() {
  const users = await User.find();
  return users.map((x) => basicDetails(x));
}

async function getInfo(id) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function getById(id) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function update(req) {
  const id = req.params.id
  const params = req.body
  const userId = req.user.id

  if (db.isValidId(id) != true) throw "Invalid User Id"
  if (id !== userId) throw "Sorry you can not update someone elses info"

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
  return await User.findOneAndUpdate({ _id: id }, { $inc: { deposit: params.deposit } }, { new: true });
}

async function reset(id) {
  return await User.findOneAndUpdate(
    { _id: id },
    { deposit: 0 },
    { new: true }
  ).select({ username: 1, deposit: 1 });
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

async function generateJwtToken(user, req) {
  // create a jwt token containing the user id that expires in 30 days
  return jwt.sign({ sub: user.id, id: user.id, token_id: await createToken(req, user) }, secret, {
    expiresIn: "30d",
  });
}

function basicDetails(user) {
  const { id, username, deposit, role } = user;
  return { id, username, deposit, role };
}

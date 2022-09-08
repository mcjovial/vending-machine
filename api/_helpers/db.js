const mongoose = require("mongoose");
const { uri, env } = require("./config");

if (env !== 'test') {
    mongoose.connect(uri, () => console.log("DB connected!!"));
    mongoose.Promise = global.Promise;
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = { isValidId };

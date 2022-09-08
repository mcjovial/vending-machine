const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoose.Promise = global.Promise;

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

let mongoM;

const memory = async () => {
  mongoM = await MongoMemoryServer.create();
  return mongoM.getUri();
};

async function connectDB() {
    memory().then((res) => {
      console.log(res);
      mongoose.connect(res).then(() => console.log(">>>Test DB connected"));
    });
}

async function disconnectDb() {
  await mongoM.stop();
  await mongoose.connection.close();
}

module.exports = { isValidId, connectDB, disconnectDb };

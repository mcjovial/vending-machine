const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { env, uri } = require('./config');

// const uri = process.env.MONGODB_URI || config.connectionString
// mongoose.connect( () => console.log('DB connected!!'));
mongoose.Promise = global.Promise;

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

let mongoM;

const memory = async () => {
    mongoM = await MongoMemoryServer.create();
    return mongoM.getUri();
}
  
async function connectDB() {
    if (env === 'test') {
        memory().then((res) => {
        console.log(res)
        mongoose.connect(res).then(() => console.log('>>>Test DB connected'))
        }) 
    } else {
        mongoose.connect(uri).then(() => console.log('>>> DB connected'));
    }
}

async function disconnectDb() {
    await mongoM.stop();
    await mongoose.connection.close();
};
  

module.exports = { isValidId, connectDB, disconnectDb }
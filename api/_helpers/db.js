const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, () => console.log('DB connected!!'));
mongoose.Promise = global.Promise;

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = { isValidId }
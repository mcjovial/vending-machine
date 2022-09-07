const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blacklistTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const BlacklistToken = mongoose.model('BlacklistToken', blacklistTokenSchema)

module.exports = BlacklistToken
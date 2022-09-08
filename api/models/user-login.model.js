const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userLoginSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    logged_out: { type: Boolean, required: true, default: false },
    logged_in_at: { type: Date, default: Date.now, required: true },
    logged_out_at: Date,
    ip_address: String,
    token_id: String,
    token_secret: String,
    token: String,
    token_deleted: { type: Boolean, required: true, default: false },
    device: String,
  },
  {
    timestamps: true,
  }
);

const UserLogin = mongoose.model("UserLogin", userLoginSchema);

module.exports = UserLogin;

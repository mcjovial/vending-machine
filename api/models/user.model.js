const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateDeposit = (e) => {
    let deposits = [0, 5, 10, 20, 50, 100];
    if (!deposits.includes(e)) return false;
    else return true;
};  

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, " {PATH} is required."],
        max: [16, "max length for {PATH} is ({MAXLENGTH})"],
        min: 5
    },
    deposit: {
        type: Number,
        default: 0,
        // validate: [
        //     validateDeposit,
        //     "Deposit can only be 5,10,20,50,100 or withdraws",
        // ]
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        message: "{VALUE} is not supported. Try {buyer/seller}",
        required: [true, " {PATH} is required. You can set {buyer/seller}"],
        lowercase: true,
        immutable: true 
    },
    // products: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "products",
    // },
    // password: { type: String, required: true },
}, { timestamps: true });

userSchema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User

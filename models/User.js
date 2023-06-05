const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    confirmed: {
        type: Boolean,
    },
    token: {
        type: String,
    },
    user_History: [{
        name: String,
        result: String,
        level: String,
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
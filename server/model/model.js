const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    gender: String,
    phone: String,
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    updatedAt:{
        type: Date,
        default: () => Date.now()
    }
});

const Userdb = mongoose.model('users', schema);

module.exports = Userdb;
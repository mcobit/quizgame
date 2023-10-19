const mongoose = require('mongoose')
//mongoose.set('debug', true);
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    image: { type: String },
    role: { type: String },
    date: { type: Date, default: Date.now },
    active: { type: Boolean, default: false }
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('userData', userSchema, 'userData')
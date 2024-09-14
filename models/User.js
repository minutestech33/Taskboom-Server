const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    fullname: { type: String, required: true, min: 4, max: 18 },
    username: { type: String, required: true, min: 4, max: 18 },
    email: { type: String, required: true },
    profile: String,
    password: { type: String, min: 4 },
    tasks: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Task'
        }
    ],
    _iAB: { type: Boolean, default: false },
    _iE: { type: Boolean, default: false },
    _iR: { type: Boolean, default: true },
    labels: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Label'
        }
    ],
}, { timestamps: true });

const User = model('User', userSchema);
module.exports = User;
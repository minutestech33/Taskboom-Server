const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const labelSchema = new Schema({
    name: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    isRegular: Boolean
}, { timestamps: true });

const Label = model('Label', labelSchema);
module.exports = Label;
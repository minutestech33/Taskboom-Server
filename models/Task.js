const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true },
    status: { type: String, required: true },
    label: { type: String, required: true },
    priority: { type: String, required: true },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const Task = model('Task', taskSchema);
module.exports = Task;
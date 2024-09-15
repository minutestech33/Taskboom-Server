const Task = require("../models/Task");
const Label = require('../models/Label');
const User = require("../models/User");

exports.getTasksAndLabels = async (req, res) => {
    try {
        const { userId } = req;
        const findUser = await User.findById({ _id: userId });
        const tasks = await Task.find({ user: userId }).sort({ createdAt: findUser?._iAB ? 1 : -1 });
        const labels = await Label.find({
            $or: [
                { user: userId },
                { isRegular: true }
            ]
        });
        if (tasks && labels) {
            return res.status(200).json({
                tasks,
                labels,
                msg: "Success"
            })
        }
        return res.status(400).json({
            msg: 'Something went to wrong while fetching tasks and labels.'
        })
    } catch (err) {
        console.log(err);
    }
}

exports.createTask = async (req, res) => {
    try {
        const { userId } = req;
        const newTask = await Task.create({
            ...req.body,
            user: userId
        })
        const saveNewTask = await newTask.save();
        if (saveNewTask) {
            return res.status(200).json({
                msg: `A ${req.body.status} task added.`
            })
        }
        return res.status(400).json({
            msg: 'Something went to wrong while creating task.'
        })
    } catch (err) {
        console.log(err);
    }
}

exports.createLabel = async (req, res) => {
    try {
        const { name } = req.body;
        const { userId } = req;
        const newLabel = new Label({
            name: name,
            user: userId,
            isRegular: false
        })
        const saveNewLabel = await newLabel.save();

        if (saveNewLabel) {
            return res.status(200).json({
                msg: 'Label created successfully.'
            })
        }
        return res.status(400).json({
            msg: 'Something went to wrong while creating label.'
        })
    } catch (err) {
        console.log(err);
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete({ _id: id });
        if (deletedTask) {
            return res.status(200).json({ msg: 'Task Deleted Successfully.' });
        }
        return res.status(400).json({ msg: 'Something went to wrong when deleting task.' });
    } catch (err) {
        console.log(err);
    }
}

exports.changeStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const changeStatus = await Task.findByIdAndUpdate(
            { _id: id },
            { $set: { status } }
        )
        if (changeStatus) {
            return res.status(200).json({ msg: 'Task Status Changed Successfully.' });
        }
        return res.status(400).json({ msg: 'Something went to wrong when changing task status.' });
    } catch (err) {
        console.log(err);
    }
}

exports.changeToAllCompleted = async (req, res) => {
    try {
        const dayStartTime = new Date();
        dayStartTime.setHours(0, 0, 0, 0);

        const dayEndTime = new Date();
        dayEndTime.setHours(23, 59, 59, 999);

        const { userId } = req;
        const findRunningForToday = await Task.find({
            user: userId, status: 'Running', createdAt: {
                $gte: dayStartTime, $lt: dayEndTime
            }
        }).countDocuments();
        if (findRunningForToday <= 0) {
            return res.status(400).json({ msg: 'No running tasks for today.' })
        }
        const changeToAllCompleted = await Task.updateMany(
            {
                user: userId, status: 'Running', createdAt: {
                    $gte: dayStartTime, $lt: dayEndTime
                }
            },
            { $set: { status: 'Completed' } }
        )
        if (changeToAllCompleted) {
            return res.status(200).json({ msg: 'All Running Task Completed for Today.' });
        }
        return res.status(400).json({ msg: 'Something went to wrong when completing all running task.' });
    } catch (err) {
        console.log(err);
    }
}

exports.isAddToBottom = async (req, res) => {
    try {
        const { userId } = req;
        const { value } = req.body;
        const updated = await User.findByIdAndUpdate(
            { _id: userId },
            { _iAB: value }
        )
        if (updated) {
            return res.status(200).json({ msg: 'Updated' });
        } else {
            return res.status(400).json({ msg: 'Something went to wrong.' });
        }
    } catch (err) {
        console.log(err);
    }
}

exports.isExpand = async (req, res) => {
    try {
        const { userId } = req;
        const { value } = req.body;
        const updated = await User.findByIdAndUpdate(
            { _id: userId },
            { _iE: value }
        )
        if (updated) {
            return res.status(200).json({ msg: 'Updated' });
        } else {
            return res.status(400).json({ msg: 'Something went to wrong.' });
        }
    } catch (err) {
        console.log(err);
    }
}

exports.isRedirect = async (req, res) => {
    try {
        const { userId } = req;
        const { value } = req.body;
        const updated = await User.findByIdAndUpdate(
            { _id: userId },
            { _iR: value }
        )
        if (updated) {
            return res.status(200).json({ msg: 'Updated' });
        } else {
            return res.status(400).json({ msg: 'Something went to wrong.' });
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getOpt = async (req, res) => {
    try {
        const { userId } = req;
        const getUserOpt = await User.findOne(
            { _id: userId },
            {
                _id: 0,
                fullname: 0,
                username: 0,
                email: 0,
                password: 0,
                profile: 0,
                tasks: 0,
                labels: 0,
                createdAt: 0,
                updatedAt: 0
            }
        );

        if (getUserOpt) {
            return res.status(200).json({
                msg: 'Success',
                opt: getUserOpt
            })
        }
        return res.status(400).json({
            msg: 'Something went to wrong when getting user opt.'
        })
    } catch (err) {
        console.log(err);
    }
}


exports.search = async (req, res) => {
    try {
        const { userId } = req;
        const { name } = req.query;

        const query = name ? name.trim() : '';

        if (query === '') {
            return res.status(200).json({
                searchTasks: [],
                _as: true
            })
        }

        const reg = new RegExp(name, 'i');

        const searchTasks = await Task.find({
            user: userId,
            title: { $regex: reg }
        });

        return res.status(200).json({
            searchTasks,
            _as: false
        });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteLabel = async (req, res) => {
    try {
        const { name } = req.params;
        const { userId } = req;
        const deleteTasks = await Task.deleteMany({ label: name, user: userId });
        const deleteLabel = await Label.deleteOne({ name });

        if (deleteTasks && deleteLabel) {
            return res.status(200).json({
                msg: 'Label deleted successfully.'
            })
        }
        return res.status(400).json({
            msg: 'Something went to wrong when deleting label.'
        })
    } catch (err) {
        console.log(err);
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const { userId } = req;
        const deleteUser = await User.findByIdAndDelete({ _id: userId });
        const deleteTasks = await Task.deleteMany({ user: userId });
        const deleteLabels = await Label.deleteMany({ user: userId });

        if (deleteUser && deleteTasks && deleteLabels) {
            return res.status(200).json({
                msg: 'Your account has been permanently deleted.'
            })
        }
        return res.status(400).json({
            msg: 'Something went to wrong when deleting account.'
        })
    } catch (err) {
        console.log(err);
    }
}

exports.editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, label, priority, status } = req.body;
        const editTask = await Task.findByIdAndUpdate(
            { _id: id },
            { $set: { title, label, priority, status } }
        )

        if (editTask) {
            return res.status(200).json({
                msg: 'Task edited successfully.'
            })
        }
        return res.status(400).json({
            msg: 'Something went to wrong when editing task.'
        })
    } catch (err) {
        console.log(err);
    }
}






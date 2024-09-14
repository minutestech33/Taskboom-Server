const express = require('express');
const taskRouter = express.Router();

const {
    getTasksAndLabels,
    createTask,
    createLabel,
    deleteTask,
    changeStatus,
    changeToAllCompleted,
    isAddToBottom,
    isExpand,
    isRedirect,
    getOpt,
    search,
    deleteLabel,
    deleteAccount,
    editTask
} = require('../controllers/taskControllers');
const {
    authMiddleware
} = require('../middlewares/authMiddleware');
const {
    validationResults
} = require('../helpers/validationResults');
const {
    createLabelValidator,
    createTaskValidator
} = require('../validators/taskValidators');

taskRouter.get('/getTasksAndLabels', authMiddleware, getTasksAndLabels);
taskRouter.post('/createTask', authMiddleware, createTaskValidator, validationResults, createTask);
taskRouter.post('/createLabel', authMiddleware, createLabelValidator, validationResults, createLabel);
taskRouter.delete('/deleteTask/:id', authMiddleware, deleteTask);
taskRouter.put('/changeStatus/:id', authMiddleware, changeStatus);
taskRouter.put('/changeToAllCompleted', authMiddleware, changeToAllCompleted);
taskRouter.put('/isAddToBottom', authMiddleware, isAddToBottom);
taskRouter.put('/isExpand', authMiddleware, isExpand);
taskRouter.put('/isRedirect', authMiddleware, isRedirect);
taskRouter.get('/getOpt', authMiddleware, getOpt);
taskRouter.get('/search', authMiddleware, search);
taskRouter.delete('/deleteLabel/:name', authMiddleware, deleteLabel);
taskRouter.delete('/deleteAccount', authMiddleware, deleteAccount);
taskRouter.put('/editTask/:id', authMiddleware, createTaskValidator, validationResults, editTask);

module.exports = taskRouter;
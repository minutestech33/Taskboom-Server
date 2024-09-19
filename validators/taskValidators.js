const { body } = require('express-validator');
const Label = require('../models/Label');

exports.createLabelValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Provide a new label name.')
        .matches(/^\S+$/).withMessage('Name must not contain any whitespace.')
        .custom(async (name, { req }) => {
            try {
                if (name === 'Regular') {
                    return Promise.reject("Label name cannot be as Regular. It's already exist.");
                }
                const findLabel = await Label.findOne({ name, user: req.userId });
                if (findLabel) return Promise.reject('Name already exist.');

                return true;
            } catch (err) {
                console.log(err);
            }
        })
]

exports.createTaskValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Provide a task title.')
]
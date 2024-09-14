const { body } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.registerValidator = [
    body('fullname')
        .trim()
        .notEmpty().withMessage('Fullname should not be empty.')
        .isLength({ min: 4, max: 18 }).withMessage('Fullname should be between 4 to 18 chars.'),
    body('username')
        .trim()
        .notEmpty().withMessage('Username should not be empty.')
        .isLength({ min: 4, max: 18 }).withMessage('Username should be between 4 to 18 chars.')
        .custom(async (username) => {
            try {
                const findUser = await User.findOne({ username });
                if (findUser) {
                    return Promise.reject('Username already taken.');
                }
            } catch (err) {
                console.log(err.message);
            }   
        }
        ),
    body('email')
        .normalizeEmail()
        .isEmail().withMessage('Provide a valid email.')
        .custom(async (email) => {
            try {
                const findEmail = await User.findOne({ email });
                if (findEmail) {
                    return Promise.reject('Email already used.');
                }
            } catch (err) {
                console.log(err.message)
            }
        }
        ),
    body('password')
        .notEmpty().withMessage('Password should not be empty.')
        .isLength({ min: 4 }).withMessage('Password must be minimum 4 chars.')
]

exports.loginValidator = [
    body('emailorusername')
        .trim()
        .notEmpty().withMessage("Provide your email or username."),
    body('password')
        .notEmpty().withMessage("Password should not be empty.")
        .custom(async (password, { req }) => {
            try {
                let user;
                const { emailorusername } = req.body;
                if (/\S+@\S+\.\S+/.test(emailorusername)) {
                    user = await User.findOne({ email: emailorusername });
                } else {
                    user = await User.findOne({ username: emailorusername });
                }
                if (!user) {
                    return Promise.reject("Invalid credentials.");
                } else {
                    const comparePass = await bcrypt.compare(password, user.password);
                    if (!comparePass) {
                        return Promise.reject('Invalid credentials.')
                    }
                }
                return true
            } catch (err) {
                console.log(err)
            }
        }
        )
]
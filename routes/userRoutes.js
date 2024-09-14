const express = require('express');
const userRouter = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
    userRegister,
    userLogin,
    googleAuth,
    getUser
} = require('../controllers/userControllers');
const {
    registerValidator,
    loginValidator
} = require('../validators/authValidators');
const {
    validationResults,
} = require('../helpers/validationResults');

userRouter.post('/register', registerValidator, validationResults, userRegister);
userRouter.post('/login', loginValidator, validationResults, userLogin);
userRouter.post('/googleAuth', googleAuth);
userRouter.get('/getUser', authMiddleware, getUser);

module.exports = userRouter;
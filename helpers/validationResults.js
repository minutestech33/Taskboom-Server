const { validationResult } = require('express-validator');

exports.validationResults = (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next();
    } else {
        return res.status(400).json({
            msg: result.array({ onlyFirstError: true })[0].msg
        })
    }
}
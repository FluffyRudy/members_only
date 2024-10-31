"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupValidator = exports.LoginValidator = void 0;
const express_validator_1 = require("express-validator");
exports.LoginValidator = [
    (0, express_validator_1.body)("username").trim().isEmail().withMessage("Email: invalid email").isLength({ max: 250 }).withMessage("Username: must be valid email"),
    (0, express_validator_1.body)("password").trim().isLength({ min: 8, max: 16 }).withMessage("Password: must be at least 8 to 16 character long")
];
exports.SignupValidator = [
    (0, express_validator_1.body)("username").trim().isEmail().withMessage("Email: invalid email"),
    (0, express_validator_1.body)("firstname").trim().isAlpha().withMessage("Firstname: Must be alphabet").isLength({ min: 3, max: 250 }).withMessage("firstname Must be atleast three character long"),
    (0, express_validator_1.body)("lastname").trim().isAlpha().withMessage("Lastname: Must be alphabet").isLength({ min: 3, max: 250 }).withMessage("Lastname Must be atleast three character long"),
    (0, express_validator_1.body)("password").trim().isLength({ min: 8, max: 16 }).withMessage("Password: must be at least 8 to 116 character long"),
];

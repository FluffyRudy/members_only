"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidator = void 0;
const express_validator_1 = require("express-validator");
exports.postValidator = [
    (0, express_validator_1.body)("title").trim().isLength({ min: 3, max: 100 }).withMessage("Title must at least be 3 characters long"),
    (0, express_validator_1.body)("content").trim().isLength({ min: 10 }).withMessage("Content must be at least 10 characters long")
];

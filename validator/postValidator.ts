import { body } from "express-validator";

export const postValidator = [
    body("title").trim().isLength({ min: 3, max: 100 }).withMessage("Title must at least be 3 characters long"),
    body("content").trim().isLength({ min: 10 }).withMessage("Content must be at least 10 characters long")
];
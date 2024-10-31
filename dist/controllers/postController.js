"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPostGet = exports.createPostPost = exports.createPostGet = void 0;
const express_validator_1 = require("express-validator");
const formatter_1 = require("../validator/formatter");
const dbClient_1 = require("../db/dbClient");
const createPostGet = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(new Error("Unauthorized access"));
    }
    res.render("createPost");
};
exports.createPostGet = createPostGet;
const createPostPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        return next(new Error("401 Unauthorized access"));
    }
    const userId = req.user.id;
    const { title, content } = req.body;
    const validatedResult = (0, express_validator_1.validationResult)(req);
    if (!validatedResult.isEmpty()) {
        res.render("createPost", { errors: (0, formatter_1.formatValidationErrors)(validatedResult.array()), title, content });
        return;
    }
    const queryString = `INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3);`;
    try {
        const insertedResult = yield dbClient_1.poolInstance.getPool().query(queryString, [title, content, userId]);
        if (insertedResult && (insertedResult === null || insertedResult === void 0 ? void 0 : insertedResult.rowCount) === 0) {
            return next(new Error("Failed to create post..."));
        }
        res.redirect("/");
    }
    catch (err) {
        return next(new Error("Internal server error. Report owner"));
    }
});
exports.createPostPost = createPostPost;
const listPostGet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        return next(new Error("Unauthorized access"));
    }
    const queryString = `SELECT * FROM posts ORDER BY create_at LIMIT $1 OFFSET $2;`;
    const fetchResult = yield dbClient_1.poolInstance.getPool().query(queryString, [5, 0]);
    if (fetchResult && (fetchResult === null || fetchResult === void 0 ? void 0 : fetchResult.rowCount) === 0) {
        res.render("postList", { posts: [] });
        return;
    }
    res.render("postList", { posts: fetchResult.rows });
});
exports.listPostGet = listPostGet;

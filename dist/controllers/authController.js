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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogoutGet = exports.userSignUpPost = exports.userSignUpGet = exports.userLoginPost = exports.userLoginGet = void 0;
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbClient_1 = require("../db/dbClient");
const random_1 = require("../utils/random");
const formatter_1 = require("../validator/formatter");
const userLoginGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("login");
});
exports.userLoginGet = userLoginGet;
const userLoginPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatorResult = (0, express_validator_1.validationResult)(req);
    if (!validatorResult.isEmpty()) {
        res.render("login", {
            errors: (0, formatter_1.formatValidationErrors)(validatorResult.array())
        });
        return;
    }
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            res.render("login", { errors: { userNotFound: "User not found" } });
            return;
        }
        req.logIn(user, (loginError) => {
            if (loginError) {
                return next(loginError);
            }
            return res.redirect("/");
        });
    })(req, res, next);
});
exports.userLoginPost = userLoginPost;
const userSignUpGet = (req, res) => {
    res.render("signup");
};
exports.userSignUpGet = userSignUpGet;
const userSignUpPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatorResult = (0, express_validator_1.validationResult)(req);
    if (!validatorResult.isEmpty()) {
        res.render("signup", {
            errors: Object.assign({}, (0, formatter_1.formatValidationErrors)(validatorResult.array())),
        });
        return;
    }
    const { username, firstname, lastname, password } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, (0, random_1.randint)(8, 14));
    try {
        const queryString = `
                INSERT INTO users (username, firstname, lastname, password, is_admin, member_status)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
        yield dbClient_1.poolInstance
            .getPool()
            .query(queryString, [
            username,
            firstname,
            lastname,
            hashedPassword,
            false,
            "pending",
        ]);
        res.redirect("/auth/login");
    }
    catch (err) {
        next(new Error("An user with this email already exists"));
    }
});
exports.userSignUpPost = userSignUpPost;
const userLogoutGet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.logOut((error) => {
        if (error) {
            return next(error);
        }
    });
    res.redirect("/");
});
exports.userLogoutGet = userLogoutGet;

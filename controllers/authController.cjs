const express = require("express");
const { validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { poolInstance } = require("../db/dbClient");
const { randint } = require("../utils/random");
const { formatValidationErrors } = require("../validator/formatter");

const userLoginGet = async (req, res) => {
    res.render("login");
};

const userLoginPost = async (req, res, next) => {
    const validatorResult = validationResult(req);
    if (!validatorResult.isEmpty()) {
        res.render("login", {
            errors: formatValidationErrors(validatorResult.array())
        });
        return;
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
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
};

const userSignUpGet = (req, res) => {
    res.render("signup");
};

const userSignUpPost = async (req, res, next) => {
    const validatorResult = validationResult(req);
    if (!validatorResult.isEmpty()) {
        res.render("signup", {
            errors: { ...formatValidationErrors(validatorResult.array()) },
        });
        return;
    }
    const { username, firstname, lastname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, randint(8, 14));
    try {
        const queryString = `
                INSERT INTO users (username, firstname, lastname, password, is_admin, member_status)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
        await poolInstance
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
    } catch (err) {
        next(new Error("An user with this email already exists"));
    }
};

const userLogoutGet = async (req, res, next) => {
    req.logOut((error) => {
        if (error) {
            return next(error);
        }
    });
    res.redirect("/");
};

module.exports = {
    userLoginGet,
    userLoginPost,
    userSignUpGet,
    userSignUpPost,
    userLogoutGet
};


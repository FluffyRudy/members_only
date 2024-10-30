import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import passport from "passport";
import bcrypt from "bcryptjs";
import { poolInstance } from "../db/dbClient";
import { randint } from "../utils/random";
import { formatValidationErrors } from "../validator/formatter";
import { User } from "../types/user";

export const userLoginGet = async (req: Request, res: Response) => {
    res.render("login");
};

export const userLoginPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validatorResult = validationResult(req);
    if (!validatorResult.isEmpty()) {
        res.render("login", {
            errors: formatValidationErrors(validatorResult.array())
        });
        return;
    }

    passport.authenticate("local", (err: Error, user: User, info: { message?: string, code?: string }) => {
        if (err) return next(err);
        if (!user) {
            res.render("login", { errors: { userNotFound: "User not found" } });
            return;
        }
        req.logIn(user, (loginError: Error) => {
            if (loginError) {
                return next(loginError);
            }
            return res.redirect("/");
        })
    })(req, res, next);
};

export const userSignUpGet = (req: Request, res: Response) => {
    res.render("signup");
};

export const userSignUpPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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

export const userLogoutGet = async (req: Request, res: Response, next: NextFunction) => {
    req.logOut((error) => {
        if (error) {
            return next(error);
        }
    });
    res.redirect("/")
}
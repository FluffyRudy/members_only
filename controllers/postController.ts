import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { validationResult } from "express-validator";
import { User } from "../types/user";
import { Post } from "../types/post";
import { formatValidationErrors } from "../validator/formatter";
import { poolInstance } from "../db/dbClient"

export const createPostGet = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return next(new Error("Unauthorized access"));
    }
    res.render("createPost");
}

export const createPostPost = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return next(new Error("401 Unauthorized access"))
    }

    const userId = (req.user as User).id;
    const { title, content }: { title: string, content: string } = req.body;

    const validatedResult = validationResult(req);
    if (!validatedResult.isEmpty()) {
        res.render("createPost", { errors: formatValidationErrors(validatedResult.array()), title, content });
        return;
    }

    const queryString = `INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3);`

    try {
        const insertedResult: QueryResult<Post> | undefined = await poolInstance.getPool().query(queryString, [title, content, userId]);
        if (insertedResult && insertedResult?.rowCount === 0) {
            return next(new Error("Failed to create post..."))
        }
        res.redirect("/");
    } catch (err) {
        return next(new Error("Internal server error. Report owner"));
    }
}

export const listPostGet = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return next(new Error("Unauthorized access"));
    }

    const queryString = `SELECT * FROM posts ORDER BY create_at LIMIT $1 OFFSET $2;`
    const fetchResult: QueryResult<Post> | undefined = await poolInstance.getPool().query(queryString, [5, 0]);

    if (fetchResult && fetchResult?.rowCount === 0) {
        res.render("postList", { posts: [] });
        return;
    }
    res.render("postList", { posts: fetchResult.rows })
}
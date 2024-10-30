import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { validationResult } from "express-validator";
import { User } from "../types/user";
import { Post } from "../types/post";
import { formatValidationErrors } from "../validator/formatter";
import { poolInstance } from "../db/dbClient"

export const createPostGet = (req: Request, res: Response) => {
    if (!req.user)
        res.redirect("/auth/login");
    res.render("createPost");
}

export const createPostPost = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
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
        if (insertedResult && insertedResult.rowCount) {
            return next("Failed to create post...")
        }
        res.redirect("/posts");
    } catch (err) {
        return next((err as Error).message);
    }
}
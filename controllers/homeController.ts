import { Request, Response } from "express";

export const homepageGet = async (req: Request, response: Response) => {
    response.render("home");
};

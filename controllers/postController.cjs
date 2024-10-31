const { validationResult } = require("express-validator");
const { poolInstance } = require("../db/dbClient");

const createPostGet = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new Error("Unauthorized access"));
  }
  res.render("createPost");
};

const createPostPost = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new Error("401 Unauthorized access"));
  }

  const userId = req.user.id;
  const { title, content } = req.body;

  const validatedResult = validationResult(req);
  if (!validatedResult.isEmpty()) {
    res.render("createPost", {
      errors: formatValidationErrors(validatedResult.array()),
      title,
      content,
    });
    return;
  }

  const queryString = `INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3);`;

  try {
    const insertedResult = await poolInstance
      .getPool()
      .query(queryString, [title, content, userId]);
    if (insertedResult && insertedResult.rowCount === 0) {
      return next(new Error("Failed to create post..."));
    }
    res.redirect("/");
  } catch (err) {
    return next(new Error("Internal server error. Report owner"));
  }
};

const listPostGet = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new Error("Unauthorized access"));
  }

  const queryString = `SELECT * FROM posts ORDER BY create_at LIMIT $1 OFFSET $2;`;
  const fetchResult = await poolInstance.getPool().query(queryString, [5, 0]);

  if (fetchResult && fetchResult.rowCount === 0) {
    res.render("postList", { posts: [] });
    return;
  }
  res.render("postList", { posts: fetchResult.rows });
};

module.exports = {
  createPostGet,
  createPostPost,
  listPostGet,
};

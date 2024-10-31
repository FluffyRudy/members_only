const express = require("express");
const {
  createPostGet,
  createPostPost,
  listPostGet,
  deletePostPost,
} = require("../controllers/postController.cjs");
const { postValidator } = require("../validator/postValidator.cjs");

const router = express.Router();

router.get("/list", listPostGet);
router.get("/create-post", createPostGet);
router.post("/create-post", postValidator, createPostPost);
router.post("/delete/:id", deletePostPost);

module.exports = router;

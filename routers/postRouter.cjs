const express = require("express");
const {
  createPostGet,
  createPostPost,
  listPostGet,
} = require("../controllers/postController.cjs");
const { postValidator } = require("../validator/postValidator.cjs");

const router = express.Router();

router.get("/list", listPostGet);
router.get("/create-post", createPostGet);
router.post("/create-post", postValidator, createPostPost);

module.exports = router;

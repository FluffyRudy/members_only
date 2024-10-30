import { Router } from "express";
import { createPostGet, createPostPost } from "../controllers/postController";
import { postValidator } from "../validator/postValidator";

const router = Router();

router.get("/create-post", createPostGet);
router.post("/create-post", postValidator, createPostPost);

export default router;
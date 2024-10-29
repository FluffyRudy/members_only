import { Router } from "express";
import { homepageGet } from "../controllers/homeController";

const router = Router();

router.get("/", homepageGet);

export default router;
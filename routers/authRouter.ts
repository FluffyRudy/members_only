import { Router } from "express";
import {
    userLoginGet,
    userLoginPost,
    userLogoutGet,
    userSignUpGet,
    userSignUpPost
} from "../controllers/authController";

import { LoginValidator, SignupValidator } from "../validator/formValidator";

const router = Router();

router.get("/login", userLoginGet);
router.post("/login", LoginValidator, userLoginPost);

router.get("/signup", userSignUpGet);
router.post("/signup", SignupValidator, userSignUpPost);

router.get("/logout", userLogoutGet);

export default router;
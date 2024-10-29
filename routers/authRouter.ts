import { Router } from "express";
import {
    userLoginGet,
    userLoginPost,
    userLogoutPost,
    userSignUpGet,
    userSignUpPost
} from "../controllers/userController";

import { LoginValidator, SignupValidator } from "../validator/formValidator";

const router = Router();

router.get("/login", userLoginGet);
router.post("/login", LoginValidator, userLoginPost);

router.get("/signup", userSignUpGet);
router.post("/signup", SignupValidator, userSignUpPost);

router.post("/logout", userLogoutPost);

export default router;
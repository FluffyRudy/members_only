const { Router } = require("express");
const {
  userLoginGet,
  userLoginPost,
  userLogoutGet,
  userSignUpGet,
  userSignUpPost,
} = require("../controllers/authController.cjs");
const {
  LoginValidator,
  SignupValidator,
} = require("../validator/formValidator.cjs");

const router = Router();

router.get("/login", userLoginGet);
router.post("/login", LoginValidator, userLoginPost);

router.get("/signup", userSignUpGet);
router.post("/signup", SignupValidator, userSignUpPost);

router.get("/logout", userLogoutGet);

module.exports = router;

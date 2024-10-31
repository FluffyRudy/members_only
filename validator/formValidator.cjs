const { body } = require("express-validator");
const LoginValidator = [
  body("username")
    .trim()
    .isEmail()
    .withMessage("Email: invalid email")
    .isLength({ max: 250 })
    .withMessage("Username: must be valid email"),
  body("password")
    .trim()
    .isLength({ min: 8, max: 16 })
    .withMessage("Password: must be at least 8 to 16 character long"),
];

const SignupValidator = [
  body("username").trim().isEmail().withMessage("Email: invalid email"),

  body("firstname")
    .trim()
    .isAlpha()
    .withMessage("Firstname: Must be alphabet")
    .isLength({ min: 3, max: 250 })
    .withMessage("firstname Must be atleast three character long"),

  body("lastname")
    .trim()
    .isAlpha()
    .withMessage("Lastname: Must be alphabet")
    .isLength({ min: 3, max: 250 })
    .withMessage("Lastname Must be atleast three character long"),

  body("password")
    .trim()
    .isLength({ min: 8, max: 16 })
    .withMessage("Password: must be at least 8 to 116 character long"),
];

module.exports = { LoginValidator, SignupValidator };

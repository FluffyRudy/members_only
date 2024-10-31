const { Router } = require("express");
const { homepageGet } = require("../controllers/homeController.cjs");

const router = Router();

router.get("/", homepageGet);

module.exports = router;

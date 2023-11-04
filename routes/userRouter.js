const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router.get("/", userController.getLoginPage);
router.post("/signUp", userController.postUserSignUp);

module.exports = router;

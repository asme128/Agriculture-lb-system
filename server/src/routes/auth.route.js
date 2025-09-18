const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate");
const { loginSchema, logoutSchema } = require("../validations/auth.validation");

const router = express.Router();

router.route("/login").post(validate(loginSchema), authController.login);
router.route("/logout").post(validate(logoutSchema), authController.logout);
router.route("/refresh").post(authController.refreshAccessToken);

module.exports = router;

const express = require("express");
const router = express.Router();
const systemController = require("../controllers/system.controller");
const validate = require("../middleware/validate");
const { updateFormsSchema } = require("../validations/system.validation");
const auth = require("../middleware/auth");

// Get system forms
router.get("/forms", auth("1", "2", "3", "4"), systemController.getForms);

// Update system forms
router.patch(
    "/forms",
    auth("2", "3"),
    validate(updateFormsSchema),
    systemController.updateForms
);

module.exports = router;

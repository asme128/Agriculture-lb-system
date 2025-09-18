const express = require("express");
const router = express.Router();
const remainderController = require("../controllers/remainder.controller");
const validate = require("../middleware/validate");
const {
    createRemainderSchema,
    updateRemainderSchema,
    getRemainderSchema,
    deleteRemainderSchema,
} = require("../validations/remainder.validation");
const auth = require("../middleware/auth");

// Create a new remainder
router.post(
    "/",
    auth("4"),
    validate(createRemainderSchema),
    remainderController.createRemainder
);

// Get all remainders
router.get("/", auth("1", "2", "3", "4"), remainderController.getAllRemainders);

// Get remainder by ID
router.get(
    "/:remainder_id",
    validate(getRemainderSchema),
    auth("1", "2", "3", "4"),
    remainderController.getRemainderById
);

// Update remainder
router.patch(
    "/",
    auth("4"),
    validate(updateRemainderSchema),
    remainderController.updateRemainder
);

// Delete remainder
router.delete(
    "/",
    auth("4"),
    validate(deleteRemainderSchema),
    remainderController.deleteRemainder
);

module.exports = router;

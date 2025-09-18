const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
    addStaffSchema,
    getStaffSchema,
    updateStaffSchema,
    updatePasswordSchema,
    deleteStaffSchema,
} = require("../validations/staff.validation");

// Create new staff
router.post(
    "/",
    auth("1"),
    validate(addStaffSchema),
    staffController.createStaff
);

// Get staff by user_id
router.get(
    "/",
    auth("1", "2", "3", "4"),
    // validate(getStaffSchema),
    staffController.getAllStaff
);

router.get(
    "/statistics",
    auth("1"),
    // validate(getStaffSchema),
    staffController.getStaffStatistics
);

router.get(
    "/:user_id",
    auth("1", "2", "3", "4"),
    validate(getStaffSchema),
    staffController.getStaffByUserId
);

// Update staff details
router.put(
    "/",
    auth("1", "2", "3", "4"),
    validate(updateStaffSchema),
    staffController.updateStaff
);

// Update staff password
router.patch(
    "/password",
    auth("1", "2", "3", "4"),
    validate(updatePasswordSchema),
    staffController.updatePassword
);

// Remove staff
router.delete(
    "/",
    auth("1"),
    validate(deleteStaffSchema),
    staffController.deleteStaff
);

module.exports = router;

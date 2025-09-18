const express = require("express");
const router = express.Router();
const operationController = require("../controllers/operation.controller");
const validate = require("../middleware/validate");
const {
    getOperationsSchema,
    updateOperationSchema,
} = require("../validations/operation.validation");
const auth = require("../middleware/auth");

// Get all operations
router.get(
    "/",
    auth("1", "2", "3", "4"),
    validate(getOperationsSchema),
    operationController.getAllOperations
);

router.patch(
    "/",
    auth("1", "2", "3", "4"),
    validate(updateOperationSchema),
    operationController.updateOperation
);

module.exports = router;

const express = require("express");
const router = express.Router();
const OperationInventoryController = require("../controllers/operation.inventory.controller");
const {
    createOperationInventorySchema,
    updateOperationInventorySchema,
    getOperationInventorySchema,
    deleteOperationInventorySchema,
} = require("../validations/operation.inventory.validation");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

router.post(
    "/",
    auth("1", "2", "3", "4"),
    validate(createOperationInventorySchema),
    OperationInventoryController.createOperationInventory
);

router.get(
    "/",
    auth("1", "2", "3", "4"),
    OperationInventoryController.getAllOperationInventory
);
router.get(
    "/aggregated",
    auth("1", "2", "3", "4"),
    OperationInventoryController.getAggregateOperationInventory
);

router.get(
    "/:operation_id",
    auth("1", "2", "3", "4"),
    validate(getOperationInventorySchema),
    OperationInventoryController.getOperationInventoryById
);

router.patch(
    "/",
    auth("1", "2", "3", "4"),
    validate(updateOperationInventorySchema),
    OperationInventoryController.updateOperationInventory
);

router.delete(
    "/:op_inv_id",
    auth("1", "2", "3", "4"),
    validate(deleteOperationInventorySchema),
    OperationInventoryController.deleteOperationInventory
);

module.exports = router;

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const validate = require("../middleware/validate");
const {
    addOperationSchema,
    getOperationSchema,
    addOperationInventorySchema,
    getOperationsSchema,
    updateOperationSchema,
    deleteOperationSchema,
} = require("../validations/operation.validation");
const auth = require("../middleware/auth");

// Create a new order
router.post(
    "/",
    auth("2", "3"),
    validate(addOperationSchema),
    orderController.createOrder
);

// add order inventory
router.post(
    "/inventory",
    auth("2", "3"),
    validate(addOperationInventorySchema),
    orderController.createOrderInventory
);

// Get all orders
router.get(
    "/",
    auth("1", "2", "3", "4"),
    validate(getOperationsSchema),
    orderController.getAllOrders
);

// Get a specific order
router.get(
    "/:operation_id",
    auth("1", "2", "3", "4"),
    validate(getOperationSchema),
    orderController.getOrderById
);

// Update a order
router.put(
    "/",
    auth("2", "3"),
    validate(updateOperationSchema),
    orderController.updateOrder
);

// Delete a order
router.delete(
    "/",
    auth("2", "3"),
    validate(deleteOperationSchema),
    orderController.deleteOrder
);

module.exports = router;

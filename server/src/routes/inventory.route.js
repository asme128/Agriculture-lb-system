// Import required modules
const express = require("express");
const upload = require("../utils/multer"); // Utility for handling file uploads
const inventoryController = require("../controllers/inventory.controller"); // Controller for inventory-related logic
const validate = require("../middleware/validate"); // Middleware for validation
const auth = require("../middleware/auth"); // Middleware for authentication

// Import validation schemas for inventory
const {
    addInventorySchema,
    updateQuantitySchema,
    updateInventorySchema,
    getInventorySchema,
    deleteInventorySchema,
} = require("../validations/inventory.validation");

// Create an instance of the Express router
const router = express.Router();

router.post(
    "/",
    auth("4"),
    validate(addInventorySchema), // Validation middleware for input data
    inventoryController.createInventory // Controller method to handle inventory creation
);

router.get(
    "/",
    auth("1", "2", "3", "4"),
    inventoryController.getAllInventory // Controller method to fetch all inventory data
);

router.get(
    "/records",
    auth("1", "2", "3", "4"),
    inventoryController.findAllInventoryRecords // Controller method to fetch all inventory data
);

router.get(
    "/:inventory_id",
    auth("1", "2", "3", "4"),
    validate(getInventorySchema), // Middleware to validate the incoming inventory_id parameter.
    inventoryController.findById // Controller method to fetch and return the inventory item.
);

router.put(
    "/recount/:inventory_id",
    auth("1", "2", "3", "4"),
    validate(updateQuantitySchema), // Middleware for input validation
    inventoryController.updateQuantity // Controller method to handle the update
);

router.put(
    "/",
    auth("1", "2", "3", "4"),
    validate(updateInventorySchema), // Middleware for schema validation
    inventoryController.updateInventory // Controller to handle update logic
);

// Define a route for deleting an inventory item by its ID
router.delete(
    "/",
    auth("4"),
    // Calls the deleteInventory method in the inventory controller
    validate(deleteInventorySchema), // Validates the format of the inventory_id
    inventoryController.deleteInventory
);

// Export the router to be used in the main application
module.exports = router;

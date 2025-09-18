const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {
    createCustomerSchema,
    updateCustomerSchema,
} = require("../validations/customer.validation");
const customerController = require("../controllers/customer.controller");
const auth = require("../middleware/auth");

// Create a new customer
router.post(
    "/",
    auth("1", "2", "3", "4"),
    validate(createCustomerSchema),
    customerController.createCustomer
);

// Get all customers with optional filtering and sorting
router.get("/", auth("1", "2", "3", "4"), customerController.getAllCustomers);

// Get a single customer by ID
router.get(
    "/:customer_id",
    auth("1", "2", "3", "4"),
    customerController.getCustomerById
);

// Update a customer
router.put(
    "/:customer_id",
    auth("1", "2", "3", "4"),
    validate(updateCustomerSchema),
    customerController.updateCustomer
);

// Delete a customer
router.delete(
    "/:customer_id",
    auth("1", "2", "3", "4"),
    customerController.deleteCustomer
);

module.exports = router;

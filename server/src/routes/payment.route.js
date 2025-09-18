// Import required modules
const express = require("express");
const paymentController = require("../controllers/payment.controller"); // Controller for payment-related logic
const validate = require("../middleware/validate"); // Middleware for validation
const auth = require("../middleware/auth"); // Middleware for authentication

// Import validation schemas for payment
const {
    createPaymentSchema,
    updatePaymentSchema,
    getPaymentSchema,
    deletePaymentSchema,
    getProfitsSchema,
    getDailyRevenueSchema,
    getMonthlyRevenueSchema,
    getYearlyRevenueSchema,
} = require("../validations/payment.validation");

// Create an instance of the Express router
const router = express.Router();

router.route("/").post(
    auth("4"),
    validate(createPaymentSchema), // Validation middleware for input data
    paymentController.createPayment // Controller method to handle payment creation
);

router
    .route("/")
    .get(auth("1", "2", "3", "4"), paymentController.findAllPayment);

router
    .route("/profits/")
    .get(
        validate(getProfitsSchema),
        auth("1"),
        paymentController.findAllProfits
    );

router
    .route("/daily")
    .get(
        auth("1"),
        validate(getDailyRevenueSchema),
        paymentController.getDailyRevenue
    );
router
    .route("/monthly")
    .get(
        auth("1"),
        validate(getMonthlyRevenueSchema),
        paymentController.getMonthlyRevenue
    );
router
    .route("/yearly")
    .get(
        auth("1"),
        validate(getYearlyRevenueSchema),
        paymentController.getYearlyRevenue
    );

router.route("/:payment_id").get(
    validate(getPaymentSchema), // Middleware to validate the incoming payment_id parameter
    auth("1", "2", "3", "4"),
    paymentController.findById // Controller method to fetch and return the payment record
);

router.route("/:payment_id").put(
    validate(updatePaymentSchema), // Middleware for schema validation
    auth("4"),
    paymentController.updatePayment // Controller to handle update logic
);

router.route("/").delete(
    validate(deletePaymentSchema), // Validates the format of the payment_id
    auth("4"),
    paymentController.deletePayment // Controller method to handle deletion
);

// Export the router to be used in the main application
module.exports = router;

// Import required modules
const express = require("express");
const personController = require("../controllers/person.constroller"); // Controller for person-related logic
const validate = require("../middleware/validate"); // Middleware for validation
const auth = require("../middleware/auth"); // Middleware for authentication
const upload = require("../middleware/multer"); // your multer file
// Import validation schemas for payment
const {
    createPersonSchema,
    updatePersonSchema,
    getPersonSchema,
    deletePaymentSchema,
    getProfitsSchema,
    getDailyRevenueSchema,
    getMonthlyRevenueSchema,
    getYearlyRevenueSchema,
} = require("../validations/person.validation");

// Create an instance of the Express router
const router = express.Router();

router.route("/person").post(
    auth("1"),
    upload.fields([
    { name: "personal_profile", maxCount: 1 },
    { name: "land_file", maxCount: 1 },
  ]),
    personController.createPerson // Controller method to handle person creation
);

router
    .route("/")
    .get(auth("1", "2", "3", "4"), personController.findAllPayment);

router
    .route("/profits/")
    .get(
        validate(getProfitsSchema),
        auth("1"),
        personController.findAllProfits
    );

router
    .route("/daily")
    .get(
        auth("1"),
        validate(getDailyRevenueSchema),
        personController.getDailyRevenue
    );
router
    .route("/monthly")
    .get(
        auth("1"),
        validate(getMonthlyRevenueSchema),
        personController.getMonthlyRevenue
    );
router
    .route("/yearly")
    .get(
        auth("1"),
        validate(getYearlyRevenueSchema),
        personController.getYearlyRevenue
    );

router.route("/:payment_id").get(
    validate(getPersonSchema), // Middleware to validate the incoming payment_id parameter
    auth("1", "2", "3", "4"),
    personController.findById // Controller method to fetch and return the payment record
);

router.route("/:payment_id").put(
    validate(updatePersonSchema), // Middleware for schema validation
    auth("4"),
    personController.updatePayment // Controller to handle update logic
);

router.route("/").delete(
    validate(deletePaymentSchema), // Validates the format of the payment_id
    auth("4"),
    personController.deletePayment // Controller method to handle deletion
);

// Export the router to be used in the main application
module.exports = router;

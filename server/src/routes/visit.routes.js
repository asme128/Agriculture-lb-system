const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visit.controller");
const {
    createVisitSchema,
    updateVisitSchema,
    getVisitSchema,
    deleteVisitSchema,
} = require("../validations/visit.validation");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

// Create a new visit
router.post(
    "/",
    auth("3"),
    validate(createVisitSchema),
    visitController.createVisit
);

// Get all visits with optional filtering
router.get("/", auth("1", "2", "3", "4"), visitController.getAllVisits);

// Get a visit by ID
router.get(
    "/:visit_id",
    auth("1", "2", "3", "4"),
    validate(getVisitSchema),
    visitController.getVisitById
);

// Update a visit
router.put(
    "/",
    auth("3"),
    validate(updateVisitSchema),
    visitController.updateVisit
);

// Delete a visit
router.delete(
    "/",
    auth("3"),
    validate(deleteVisitSchema),
    visitController.deleteVisit
);

module.exports = router;

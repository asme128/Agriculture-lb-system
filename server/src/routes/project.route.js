const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
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

// Create a new project
router.post(
    "/",
    auth("2", "3"),
    validate(addOperationSchema),
    projectController.createProject
);

// add project inventory
router.post(
    "/inventory",
    auth("2", "3"),
    validate(addOperationInventorySchema),
    projectController.createProjectInventory
);

// Get all projects
router.get(
    "/",
    auth("1", "2", "3", "4"),
    validate(getOperationsSchema),
    projectController.getAllProjects
);

// Get a specific project
router.get(
    "/:operation_id",
    auth("1", "2", "3", "4"),
    validate(getOperationSchema),
    projectController.getProjectById
);

// Update a project
router.put(
    "/",
    auth("2", "3"),
    validate(updateOperationSchema),
    projectController.updateProject
);

// Delete a project
router.delete(
    "/",
    auth("2", "3"),
    validate(deleteOperationSchema),
    projectController.deleteProject
);

module.exports = router;

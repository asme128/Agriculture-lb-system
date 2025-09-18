const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const validate = require("../middleware/validate");
const {
    createExpenseSchema,
    updateExpenseSchema,
    getExpenseSchema,
    deleteExpenseSchema,
    getExpensesSchema,
} = require("../validations/expense.validation");
const auth = require("../middleware/auth");

// Create a new expense
router.post(
    "/",
    auth("4"),
    validate(createExpenseSchema),
    expenseController.createExpense
);

// Get all expenses
router.get(
    "/",
    auth("1", "2", "3", "4"),
    validate(getExpensesSchema),
    expenseController.getAllExpenses
);

// Get expense by ID
router.get(
    "/:expense_id",
    auth("4"),
    validate(getExpenseSchema),
    expenseController.getExpenseById
);

// Update expense
router.patch(
    "/",
    auth("4"),
    validate(updateExpenseSchema),
    expenseController.updateExpense
);

// Delete expense
router.delete(
    "/",
    auth("4"),
    validate(deleteExpenseSchema),
    expenseController.deleteExpense
);

module.exports = router;

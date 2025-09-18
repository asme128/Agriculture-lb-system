const Expense = require("../models/expense.model");
const Operation = require("../models/operations.model");
const CustomError = require("../utils/CustomError");

class ExpenseService {
    async createExpense(expenseData) {
        try {
            const expense = await Expense.create(expenseData);

            if (expense.expense_for) {
                try {
                    const operation = await Operation.findById(
                        expense.expense_for,
                        expense.type
                    );
                    if (operation) {
                        const newTotalCost =
                            operation.total_cost + expense.expense_amount;

                        await Operation.update(
                            expense.expense_for,
                            {
                                total_cost: newTotalCost,
                            },
                            expense.type
                        );
                    }
                } catch (err) {
                    await Expense.delete(expense.expense_id);
                    throw new CustomError(err.statusCode || 500, err.message);
                }
            }
            return expense;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getAllExpenses(options = {}) {
        try {
            return await Expense.findAll(options);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getExpenseById(expense_id) {
        try {
            return await Expense.findById(expense_id);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async updateExpense(expense_id, expenseData) {
        try {
            const expense = await Expense.findById(expense_id);
            const operation = await Operation.findById(
                expense.expense_for,
                expense.type
            );

            if (expense && operation) {
                try {
                    const costDifference =
                        expenseData?.expense_amount - expense.expense_amount ||
                        0;

                    await Operation.update(
                        expense.expense_for,
                        {
                            total_cost: operation.total_cost + costDifference,
                        },
                        expense.type
                    );
                } catch (err) {
                    throw new CustomError(err.statusCode || 500, err.message);
                }
                return await Expense.update(expense_id, expenseData);
            }
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async deleteExpense(expense_id) {
        try {
            const expense = await Expense.findById(expense_id);
            const operation = await Operation.findById(
                expense.expense_for,
                expense.type
            );

            if (expense && operation) {
                const newTotalCost =
                    operation.total_cost - expense.expense_amount;

                await Operation.update(
                    expense.expense_for,
                    {
                        total_cost: newTotalCost,
                    },
                    expense.type
                );
            }

            return await Expense.delete(expense_id);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }
}

module.exports = new ExpenseService();

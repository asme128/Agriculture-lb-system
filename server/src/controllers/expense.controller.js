const expenseService = require("../services/expense.service");
const QueryBuilder = require("../utils/queryBuilder");

class ExpenseController {
    async createExpense(req, res, next) {
        try {
            const expense = await expenseService.createExpense(req.body);

            
            res.status(201).json({
                success: true,
                message: "Expense created successfully",
                data: expense,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllExpenses(req, res, next) {
        try {
            const options = QueryBuilder.buildOptions(req);
            const expenses = await expenseService.getAllExpenses(options);
            res.status(200).json(expenses);
        } catch (error) {
            next(error);
        }
    }

    async getExpenseById(req, res, next) {
        try {
            const expense = await expenseService.getExpenseById(
                req.params.expense_id
            );
            res.status(200).json({
                success: true,
                data: expense,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateExpense(req, res, next) {
        try {
            const { expense_id, ...expenseData } = req.body;
            const expense = await expenseService.updateExpense(
                expense_id,
                expenseData
            );
            res.status(200).json({
                success: true,
                message: "Expense updated successfully",
                data: expense,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteExpense(req, res, next) {
        try {
            await expenseService.deleteExpense(req.body.expense_id);
            res.status(200).json({
                success: true,
                message: "Expense deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ExpenseController();

const Joi = require("joi");

const createExpenseSchema = {
    body: Joi.object()
        .keys({
            expense_name: Joi.string().max(255).required(),
            expense_reason: Joi.string().max(500).required(),
            expense_amount: Joi.number().precision(2).min(0).required(),
            expense_for: Joi.string().max(255).allow(null, "").optional(),
            registered_by: Joi.string().max(255).required(),
            expense_date: Joi.date().default(new Date()),
            type: Joi.string()
                .max(255)
                .default("none")
                .allow(null, "")
                .optional(),
        })
        .required(),
};

const updateExpenseSchema = {
    body: Joi.object()
        .keys({
            expense_id: Joi.string().max(255).required(),
            expense_name: Joi.string().max(255).optional(),
            expense_reason: Joi.string().max(500).optional(),
            expense_amount: Joi.number().precision(2).min(0).optional(),
            expense_for: Joi.string().max(255).optional(),
            registered_by: Joi.string().max(255).optional(),
            expense_date: Joi.date().allow(null).optional(),
            type: Joi.string().max(255).optional(),
        })
        .min(1)
        .required(),
};

const getExpenseSchema = {
    params: Joi.object()
        .keys({
            expense_id: Joi.string().max(255).required(),
        })
        .required(),
};

const getExpensesSchema = {
    params: Joi.object().keys({
        start_date: Joi.string().allow(null, "").optional(),
        end_date: Joi.string().allow(null, "").optional(),
        sort_by: Joi.string().allow(null, "").optional(),
        sort_direction: Joi.string().allow(null, "").optional(),
        expense_for: Joi.string().allow(null, "").optional(),
        registered_by: Joi.string().allow(null, "").optional(),
        expense_date: Joi.date().allow(null).optional(),
        type: Joi.string().allow(null, "").optional(),
    }),
};

const deleteExpenseSchema = {
    body: Joi.object()
        .keys({
            expense_id: Joi.string().max(255).required(),
        })
        .required(),
};

module.exports = {
    createExpenseSchema,
    updateExpenseSchema,
    getExpenseSchema,
    getExpensesSchema,
    deleteExpenseSchema,
};

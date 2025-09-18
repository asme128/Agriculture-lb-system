const Joi = require("joi");

// Validation schema for creating a payment
const createPaymentSchema = {
    body: Joi.object()
        .keys({
            payment_date: Joi.date().default(new Date()).required(),
            payment_for: Joi.string().max(255).required(),
            type: Joi.string().max(255).required(),
            payment_reason: Joi.string().max(500).required(),
            amount: Joi.number().precision(2).min(0).required(),
            registered_by: Joi.string().max(255).required(),
        })
        .required(),
};

// Validation schema for updating a payment
const updatePaymentSchema = {
    params: Joi.object()
        .keys({
            payment_id: Joi.string().max(255).required(),
        })
        .required(),
    body: Joi.object()
        .keys({
            payment_date: Joi.date().optional(),
            payment_for: Joi.string().max(255).optional(),
            type: Joi.string().max(255).optional(),
            payment_reason: Joi.string().max(500).optional(),
            amount: Joi.number().precision(2).min(0).optional(),
            registered_by: Joi.string().max(255).optional(),
        })
        .min(1)
        .required(),
};

// Validation schema for retrieving a payment by ID
const getPaymentSchema = {
    params: Joi.object()
        .keys({
            payment_id: Joi.string().max(255).required(),
        })
        .required(),
};

const getProfitsSchema = {
    params: Joi.object()
        .keys({
            start_date: Joi.string().allow(null, "").optional(),
            end_date: Joi.string().allow(null, "").optional(),
            sort_by: Joi.string().allow(null, "").optional(),
            sort_direction: Joi.string().allow(null, "").optional(),
            status: Joi.string().allow(null, "").optional(),
            stock_status: Joi.string().allow(null, "").optional(),
            payment_status: Joi.string().allow(null, "").optional(),
            proforma_by: Joi.string().allow(null, "").optional(),
            approved_by: Joi.string().allow(null, "").optional(),
            proforma_created: Joi.string()
                .valid("0", "1")
                .allow(null, "")
                .optional(),
            type: Joi.string().allow(null, "").optional(),
        })
        .required(),
};
// Validation schema for deleting a payment by ID
const deletePaymentSchema = {
    body: Joi.object()
        .keys({
            payment_id: Joi.string().max(255).required(),
        })
        .required(),
};

const getDailyRevenueSchema = {
    query: Joi.object().keys({
        start_day: Joi.number().required(),
        end_day: Joi.number().required(),
        current_month: Joi.number().required(),
        current_year: Joi.number().required(),
    }),
};

const getMonthlyRevenueSchema = {
    query: Joi.object().keys({
        start_month: Joi.number().required(),
        end_month: Joi.number().required(),
        current_year: Joi.number().required(),
    }),
};

const getYearlyRevenueSchema = {
    query: Joi.object().keys({
        start_year: Joi.number().required(),
        end_year: Joi.number().required(),
    }),
};

// Export all validation schemas
module.exports = {
    createPaymentSchema,
    updatePaymentSchema,
    getPaymentSchema,
    getProfitsSchema,
    deletePaymentSchema,
    getDailyRevenueSchema,
    getMonthlyRevenueSchema,
    getYearlyRevenueSchema,
};

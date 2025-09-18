const Joi = require("joi");
// Validation schema for creating a person
const createPersonSchema = {
    body: Joi.object()
        .keys({
            first_name: Joi.string().max(255).required(),
            second_name: Joi.string().max(255).required(),
            last_name: Joi.string().max(255).required(),
            email: Joi.string().email().max(255).required(),
            address: Joi.string().max(500).optional(),
            woreda: Joi.string().max(255).optional(),
            region: Joi.string().max(255).optional(),
            kebele: Joi.string().max(255).optional(),
            zone: Joi.string().max(255).optional(),
            gender: Joi.string().valid("male", "female", "other").required(),
            phone: Joi.string().required(),
        })
        .required(),
};

// Validation schema for updating a person
const updatePersonSchema = {
    params: Joi.object()
        .keys({
            person_id: Joi.string().max(255).required(),
        })
        .required(),
    body: Joi.object()
        .keys({
            first_name: Joi.string().max(255).required(),
            second_name: Joi.string().max(255).required(),
            last_name: Joi.string().max(255).required(),
            email: Joi.string().email().max(255).required(),
            gender: Joi.string().valid("male", "female", "other").required(),
            phone: Joi.string().required(),
        })
        .min(1)
        .required(),
};

// Validation schema for retrieving a person by ID
const getPersonSchema = {
    params: Joi.object()
        .keys({
            person_id: Joi.string().max(255).required(),
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
    createPersonSchema,
    updatePersonSchema,
    getPersonSchema,
    getProfitsSchema,
    deletePaymentSchema,
    getDailyRevenueSchema,
    getMonthlyRevenueSchema,
    getYearlyRevenueSchema,
};

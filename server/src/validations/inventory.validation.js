const Joi = require("joi");

const addInventorySchema = {
    body: Joi.object()
        .keys({
            user_id: Joi.string().max(255).required(),
            inventory_id: Joi.string().max(255),
            inventory_name: Joi.string().max(500).required(),
            unit: Joi.string().max(255).required(),
            quantity: Joi.number().integer().min(0).required(), // Quantity must be an integer
            buying_price: Joi.number().precision(2).min(0).required(), // Allow decimals up to 2 places
            selling_price: Joi.number().precision(2).min(0).required(), // Allow decimals up to 2 places
            acquired_from: Joi.string().max(255).required(),
        })
        .required(),
};

const updateQuantitySchema = {
    params: Joi.object()
        .keys({
            inventory_id: Joi.string().max(255).required(), // Validate `inventory_id` as a required string
        })
        .required(),
    body: Joi.object()
        .keys({
            quantity: Joi.number().integer().min(0).required(), // Ensure `quantity` is an integer and >= 0
        })
        .required(),
};

const updateInventorySchema = {
    body: Joi.object()
        .keys({
            user_id: Joi.string().max(255).required(),
            inventory_id: Joi.string().max(255).required(), // Required in body to locate record
            inventory_name: Joi.string().max(500).optional(),
            unit: Joi.string().max(255).optional(),
            quantity: Joi.number().integer().min(0).optional(), // Quantity must still be an integer
            buying_price: Joi.number().precision(2).min(0).optional(), // Allow decimals up to 2 places
            selling_price: Joi.number().precision(2).min(0).optional(), // Allow decimals up to 2 places
            acquired_from: Joi.string().max(255).optional(),
        })
        .required(),
};

const getInventorySchema = {
    params: Joi.object()
        .keys({
            inventory_id: Joi.string().max(255).required(), // Required to fetch a specific inventory item
        })
        .required(),
};
const deleteInventorySchema = {
    body: Joi.object()
        .keys({
            inventory_id: Joi.string().max(255).required(), // Required to fetch a specific inventory item
        })
        .required(),
};

const getInventoryRecordsSchema = {
    params: Joi.object()
        .keys({
            start_date: Joi.string().allow(null, "").optional(),
            end_date: Joi.string().allow(null, "").optional(),
            sort_by: Joi.string().allow(null, "").optional(),
            sort_direction: Joi.string().allow(null, "").optional(),
        })
        .required(),
};

module.exports = {
    addInventorySchema,
    deleteInventorySchema,
    updateInventorySchema,
    updateQuantitySchema,
    getInventorySchema,
    getInventoryRecordsSchema,
};

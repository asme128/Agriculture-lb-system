const Joi = require("joi");

const createCustomerSchema = Joi.object({
    first_name: Joi.string().required().min(2).max(50),
    last_name: Joi.string().required().min(2).max(50),
    gender: Joi.string().valid("male", "female", "other").required(),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
    email: Joi.string().email().required(),
    registered_by: Joi.string().required(),
});

const updateCustomerSchema = Joi.object({
    first_name: Joi.string().min(2).max(50),
    last_name: Joi.string().min(2).max(50),
    gender: Joi.string().valid("male", "female", "other"),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    email: Joi.string().email(),
}).min(1); // At least one field is required for update

module.exports = {
    createCustomerSchema,
    updateCustomerSchema,
};

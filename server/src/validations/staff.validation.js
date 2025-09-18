const Joi = require("joi");

const addStaffSchema = {
    body: Joi.object().keys({
        staff_id: Joi.string().required(),
        role_id: Joi.string().required(),
        user_name: Joi.string().required(),
        user_password: Joi.string().required(),
        gender: Joi.string().valid("male", "female").required(),
        phone: Joi.string().required(),
    }),
};

const updateStaffSchema = {
    body: Joi.object({
        user_id: Joi.string().required(),
        staff_id: Joi.string(),
        role_id: Joi.string(),
        user_name: Joi.string(),
        gender: Joi.string().valid("male", "female"),
        phone: Joi.number(),
    }),
};

const updatePasswordSchema = {
    body: Joi.object({
        user_id: Joi.string().required(),
        current_password: Joi.string().required(),
        new_password: Joi.string().required(),
    }),
};

const getStaffSchema = {
    params: Joi.object().keys({
        user_id: Joi.string().required(),
    }),
};

const deleteStaffSchema = {
    body: Joi.object().keys({
        user_id: Joi.string().required(),
    }),
};

module.exports = {
    addStaffSchema,
    getStaffSchema,
    updateStaffSchema,
    updatePasswordSchema,
    deleteStaffSchema,
};

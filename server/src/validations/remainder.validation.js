const Joi = require("joi");

const createRemainderSchema = {
    body: Joi.object()
        .keys({
            remainder_for: Joi.string().max(255).required(),
            user_id: Joi.string().max(255).required(),
            amount: Joi.number().precision(2).min(0).required(),
            type: Joi.string().max(255).required(),
            remainder_date: Joi.date().default(new Date()),
            remainder_reason: Joi.string().max(500).required(),
        })
        .required(),
};

const updateRemainderSchema = {
    body: Joi.object()
        .keys({
            remainder_id: Joi.string().max(255).required(),
            remainder_for: Joi.string().max(255).optional(),
            user_id: Joi.string().max(255).optional(),
            amount: Joi.number().precision(2).min(0).optional(),
            type: Joi.string().max(255).optional(),
            remainder_date: Joi.date().allow(null).optional(),
            remainder_reason: Joi.string().max(500).optional(),
        })
        .min(1)
        .required(),
};

const getRemainderSchema = {
    params: Joi.object()
        .keys({
            remainder_id: Joi.string().max(255).required(),
        })
        .required(),
};

const deleteRemainderSchema = {
    body: Joi.object()
        .keys({
            remainder_id: Joi.string().max(255).required(),
        })
        .required(),
};

module.exports = {
    createRemainderSchema,
    updateRemainderSchema,
    getRemainderSchema,
    deleteRemainderSchema,
};

const Joi = require("joi");

const loginSchema = {
    body: Joi.object().keys({
        staff_id: Joi.string().required(),
        user_password: Joi.string().required(),
    }),
};

const logoutSchema = {
    body: Joi.object().keys({
        user_id: Joi.string().required(),
    }),
};

module.exports = {
    loginSchema,
    logoutSchema,
};

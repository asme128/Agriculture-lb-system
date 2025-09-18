const Joi = require("joi");

const uploadSchema = {
    body: Joi.object().keys({
        // Add additional fields if required
    }),
};

module.exports = {
    uploadSchema,
};

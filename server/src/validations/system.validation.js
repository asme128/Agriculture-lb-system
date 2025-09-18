const Joi = require("joi");

const updateFormsSchema = Joi.object({
    order_form: Joi.string().allow("").optional(),
    project_form: Joi.string().allow("").optional(),
    bid_form: Joi.string().allow("").optional(),
    visit_form: Joi.string().allow("").optional(),
})
    .min(1)
    .messages({
        "object.min": "At least one form field must be provided for update",
    });

module.exports = {
    updateFormsSchema,
};

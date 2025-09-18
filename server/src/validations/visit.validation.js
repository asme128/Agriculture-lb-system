const Joi = require("joi");

const operationDataSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string()
        .valid(
            "voice",
            "image",
            "multiline",
            "textfield",
            "dropdown",
            "checkbox"
        )
        .required(),
    value: Joi.alternatives()
        .try(
            Joi.string().allow(null, ""),
            Joi.array().items(Joi.string()).allow(null) // Assuming array of strings, adjust as needed
        )
        .optional(),
    required: Joi.boolean().allow(null).optional(),
});

// Validation schema for creating a visit
const createVisitSchema = {
    body: Joi.object()
        .keys({
            visit_by: Joi.string().max(255).required(),
            visit_data: Joi.array().items(operationDataSchema),
            visit_date: Joi.date().required(),
            registered_by: Joi.string().max(255).required(),
        })
        .required(),
};

// Validation schema for updating a visit
const updateVisitSchema = {
    body: Joi.object()
        .keys({
            visit_id: Joi.string().max(255).required(),
            visit_by: Joi.string().max(255).allow(null).optional(),
            visit_data: Joi.array().items(operationDataSchema).optional(),
            visit_date: Joi.date().allow(null).optional(),
            registered_by: Joi.string().max(255).allow(null).optional(),
        })
        .min(1)
        .required(),
};

// Validation schema for retrieving a visit by ID
const getVisitSchema = {
    params: Joi.object()
        .keys({
            visit_id: Joi.string().max(255).required(),
        })
        .required(),
};

// Validation schema for deleting a visit by ID
const deleteVisitSchema = {
    body: Joi.object()
        .keys({
            visit_id: Joi.string().max(255).required(),
        })
        .required(),
};

// Export all validation schemas
module.exports = {
    createVisitSchema,
    updateVisitSchema,
    getVisitSchema,
    deleteVisitSchema,
};

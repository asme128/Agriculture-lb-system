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

// Validation schema for creating a bid
const createBidSchema = {
    body: Joi.object()
        .keys({
            bid_by: Joi.string().max(255).required(),
            bid_data: Joi.array().items(operationDataSchema),
            bid_date: Joi.date().required(),
            registered_by: Joi.string().max(255).required(),
        })
        .required(),
};

// Validation schema for updating a bid
const updateBidSchema = {
    body: Joi.object()
        .keys({
            bid_id: Joi.string().max(255).required(),
            bid_by: Joi.string().max(255).allow(null).optional(),
            bid_data: Joi.array().items(operationDataSchema).optional(),
            bid_date: Joi.date().allow(null).optional(),
            registered_by: Joi.string().max(255).allow(null).optional(),
        })
        .min(1)
        .required(),
};

// Validation schema for retrieving a bid by ID
const getBidSchema = {
    params: Joi.object()
        .keys({
            bid_id: Joi.string().max(255).required(),
        })
        .required(),
};

// Validation schema for deleting a bid by ID
const deleteBidSchema = {
    body: Joi.object()
        .keys({
            bid_id: Joi.string().max(255).required(),
        })
        .required(),
};

// Export all validation schemas
module.exports = {
    createBidSchema,
    updateBidSchema,
    getBidSchema,
    deleteBidSchema,
};

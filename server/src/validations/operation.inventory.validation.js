const Joi = require("joi");

const createOperationInventorySchema = {
    body: Joi.object({
        operation_id: Joi.string().required(),
        type: Joi.string().required(),
        inventory_id: Joi.string().required(),
        quantity_required: Joi.number().required().min(1),
        price: Joi.number().required().min(0),
        added_date: Joi.date().required(),
        customized_by: Joi.string().required(),
    }),
};

const updateOperationInventorySchema = {
    body: Joi.object({
        op_inv_id: Joi.string().required(),
        type: Joi.string().allow(null),
        inventory_id: Joi.string().allow(null),
        quantity_required: Joi.number().min(1),
        price: Joi.number().min(0),
        comment: Joi.string().allow(null),
        added_date: Joi.date().allow(null),
        customized_by: Joi.string().allow(null),
    }).required(),
};

const getOperationInventorySchema = {
    params: Joi.object({
        operation_id: Joi.string().required(),
        type: Joi.alternatives()
            .try(
                Joi.string().required(),
                Joi.array().items(Joi.string().required()) // Assuming array of strings, adjust as needed
            )
            .optional(),
    }),
};

const deleteOperationInventorySchema = {
    body: Joi.object().keys({
        op_inv_id: Joi.string().required(),
        // type: Joi.string().required(),
    }),
};

module.exports = {
    createOperationInventorySchema,
    updateOperationInventorySchema,
    getOperationInventorySchema,
    deleteOperationInventorySchema,
};

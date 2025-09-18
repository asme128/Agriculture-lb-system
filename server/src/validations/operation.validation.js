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

const inventorySchema = Joi.object({
    customized_by: Joi.string().allow(null, "").optional(),
    op_inv_id: Joi.string().allow(null, "").optional(),
    inventory_id: Joi.string().required(),
    inventory_name: Joi.string().required(),
    price: Joi.number().required(),
    quantity_required: Joi.number().required(),
    comment: Joi.string().allow(null, "").optional(),
});

const addOperationSchema = {
    body: Joi.object()
        .keys({
            operation_name: Joi.string().required(),
            customer_id: Joi.string().required(),
            operation_data: Joi.array().items(operationDataSchema),
            operation_status: Joi.string()
                .valid("pending", "approved", "rejected", "completed")
                .default("pending"),
            payment_status: Joi.string()
                .valid("not paid", "paid", "partial")
                .default("not paid"),
            stock_status: Joi.string().required(),
            created_by: Joi.string().required(),
            created_at: Joi.date().default(new Date()),
            approved_by: Joi.string().allow(null, "").optional(),
            approved_at: Joi.date().allow(null).optional(),
            proforma_created: Joi.string().valid("0", "1").default("0"),
            proforma_by: Joi.string().allow(null, "").optional(),
            proforma_date: Joi.date().allow(null).optional(),
            total_cost: Joi.number().allow(null).optional(),
            note: Joi.string().allow(null).optional(),
            inventory_data: Joi.array().items(inventorySchema),
        })
        .required(),
};

const addOperationInventorySchema = {
    body: Joi.object()
        .keys({
            operation_id: Joi.string().required(),
            type: Joi.string().valid("project", "order"),
            inventory_data: Joi.array().items(inventorySchema),
        })
        .required(),
};

const getOperationSchema = {
    params: Joi.object().keys({
        operation_id: Joi.string().required(),
    }),
};

const deleteOperationSchema = {
    body: Joi.object().keys({
        operation_id: Joi.string().required(),
    }),
};

const getOperationsSchema = {
    params: Joi.object().keys({
        start_date: Joi.string().allow(null, "").optional(),
        end_date: Joi.string().allow(null, "").optional(),
        sort_by: Joi.string().allow(null, "").optional(),
        sort_direction: Joi.string().allow(null, "").optional(),
        status: Joi.string().allow(null, "").optional(),
        stock_status: Joi.string().allow(null, "").optional(),
        payment_status: Joi.string().allow(null, "").optional(),
        proforma_by: Joi.string().allow(null, "").optional(),
        approved_by: Joi.string().allow(null, "").optional(),
        proforma_created: Joi.string()
            .valid("0", "1")
            .allow(null, "")
            .optional(),
        type: Joi.string().allow(null, "").optional(),
    }),
};

const updateOperationSchema = {
    body: Joi.object()
        .keys({
            operation_id: Joi.string().required(),
            operation_name: Joi.string().allow(null, "").optional(),
            customer_id: Joi.string().allow(null, "").optional(),
            operation_data: Joi.array().items(operationDataSchema),
            operation_status: Joi.string()
                .valid("pending", "approved", "rejected", "completed")
                .allow(null, "")
                .optional(),
            payment_status: Joi.string()
                .valid("not paid", "paid", "partial")
                .allow(null, "")
                .optional(),
            stock_status: Joi.string().allow(null, "").optional(),
            created_by: Joi.string().allow(null, "").optional(),
            created_at: Joi.date().allow(null).optional(),
            approved_by: Joi.string().allow(null, "").optional(),
            approved_at: Joi.date().allow(null).optional(),
            proforma_created: Joi.string()
                .valid("0", "1")
                .allow(null, "")
                .optional(),
            proforma_by: Joi.string().allow(null, "").optional(),
            proforma_date: Joi.date().allow(null).optional(),
            total_cost: Joi.number().allow(null).optional(),
            note: Joi.string().allow(null, "").optional(),
            inventory_data: Joi.array().items(inventorySchema),
            type: Joi.string().allow(null, "").optional(),
        })
        .required(),
};

module.exports = {
    addOperationSchema,
    getOperationSchema,
    getOperationsSchema,
    addOperationInventorySchema,
    updateOperationSchema,
    deleteOperationSchema,
};

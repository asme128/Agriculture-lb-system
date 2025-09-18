const Operation = require("../models/operations.model");
const OperationInventory = require("../models/operations.inventory.model");
const CustomError = require("../utils/CustomError");
const fs = require("fs").promises;
const path = require("path");

class OrderService {
    async createOrder(orderData) {
        try {
            // Validate order data
            if (!orderData.operation_name || !orderData.customer_id) {
                throw new CustomError(
                    400,
                    "Order name and customer ID are required"
                );
            }

            // Set default values if not provided
            orderData.operation_status =
                orderData.operation_status || "pending";
            orderData.payment_status = orderData.payment_status || "not paid";
            orderData.proforma_created = orderData.proforma_created || "0";

            // Create order
            const orderId = await Operation.create({
                ...orderData,
                type: "order",
            });

            return orderId;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async addInventory(inventoryData) {
        try {
            // Validate order data
            if (!inventoryData.operation_id) {
                throw new CustomError(400, "Order ID is required");
            }

            // Create order
            const operationId = await OperationInventory.create({
                ...inventoryData,
                type: "order",
                added_date: new Date(),
            });

            return operationId;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getAllOrders(options = {}) {
        try {
            const orders = await Operation.findAll("order", options);
            return orders;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getOrderById(operation_id) {
        try {
            const order = await Operation.findById(operation_id, "order");
            if (!order) {
                throw new CustomError(404, "Order not found");
            }
            return order;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async updateOrder(operation_id, orderData) {
        try {
            // Check if order exists
            const existingOrder = await Operation.findById(
                operation_id,
                "order"
            );
            if (!existingOrder) {
                throw new CustomError(404, "Order not found");
            }

            // Proceed only if operation_data is present update file data accordingly
            if (orderData.operation_data) {
                let oldData = [];
                try {
                    oldData = Array.isArray(existingOrder.operation_data)
                        ? existingOrder.operation_data
                        : JSON.parse(existingOrder.operation_data || "[]");
                } catch (err) {
                    console.error(
                        "Error parsing existing operation_data:",
                        err
                    );
                }

                let newData = [];
                try {
                    newData = Array.isArray(orderData.operation_data)
                        ? orderData.operation_data
                        : JSON.parse(orderData.operation_data || "[]");
                } catch (err) {
                    console.error("Error parsing new operation_data:", err);
                }

                // Create maps for quick lookup
                const oldDataMap = new Map(
                    oldData.map((item) => [item.name, item])
                );

                // Merge newData with oldData
                const mergedData = newData.map((newItem) => {
                    const oldItem = oldDataMap.get(newItem.name);
                    if (
                        (newItem.type === "voice" ||
                            newItem.type === "image") &&
                        !newItem.value &&
                        oldItem?.value
                    ) {
                        return { ...newItem, value: oldItem.value };
                    }
                    return newItem;
                });

                // Files to delete: old items not present in merged data

                for (const oldItem of oldData) {
                    if (
                        (oldItem.type === "voice" ||
                            oldItem.type === "image") &&
                        oldItem.value
                    ) {
                        const newItem = mergedData.find(
                            (item) => item.name === oldItem.name
                        );

                        const fileWasRemoved =
                            !newItem || // item no longer exists
                            !newItem.value || // item exists but has no file now
                            newItem.value !== oldItem.value; // file was replaced

                        if (fileWasRemoved) {
                            const filename = path.basename(oldItem.value);
                            const folder =
                                oldItem.type === "voice"
                                    ? "uploads/voice"
                                    : "uploads/images";
                            const filePath = path.join(
                                __dirname,
                                "..",
                                folder,
                                filename
                            );

                            try {
                                await fs.unlink(filePath);
                                console.log(
                                    `✅ Deleted unused ${oldItem.type} file: ${filename}`
                                );
                            } catch (err) {
                                console.error(
                                    `❌ Error deleting ${oldItem.type} file ${filename}:`,
                                    err
                                );
                            }
                        }
                    }
                }

                // Save merged data back to orderData
                orderData.operation_data = mergedData;
            }

            // Update order
            await Operation.update(operation_id, orderData, "order");
            return operation_id;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async deleteOrder(operation_id) {
        try {
            // Check if order exists
            const existingOrder = await Operation.findById(
                operation_id,
                "order"
            );
            if (!existingOrder) {
                throw new CustomError(404, "Order not found");
            }

            // Handle operation_data (could be string or already parsed object)
            let operationData;
            try {
                operationData =
                    typeof existingOrder.operation_data === "string"
                        ? JSON.parse(existingOrder.operation_data || "[]")
                        : existingOrder.operation_data || [];
            } catch (err) {
                console.error("Error parsing operation_data:", err);
                operationData = [];
            }

            // Delete associated files
            for (const item of operationData) {
                if (item.type === "voice" || item.type === "image") {
                    // Extract filename from the path
                    const filename = path.basename(item?.value || "");
                    const filePath = path.join(
                        __dirname,
                        "..",
                        item.type === "voice"
                            ? "uploads/voice"
                            : "uploads/images",
                        filename
                    );

                    try {
                        await fs.unlink(filePath);
                    } catch (err) {
                        console.error(
                            `Error deleting ${item.type} file ${filename}:`,
                            err
                        );
                    }
                }
            }

            // Delete order
            await Operation.delete(operation_id, "order");
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async deleteOrderInventory(operation_id) {
        try {
            // Check if order exists
            const existingOrder = await Operation.findById(
                operation_id,
                "order"
            );
            if (!existingOrder) {
                throw new CustomError(404, "Order not found");
            }
            // Delete order
            await OperationInventory.delete(operation_id, "order");
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }
}

module.exports = new OrderService();

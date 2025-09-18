const OrderService = require("../services/order.service");
const InventoryService = require("../services/inventory.service");
const OperationInventoryService = require("../services/operation.inventory.service");
const remainderService = require("../services/remainder.service");

const createOrder = async (req, res) => {
    try {
        const orderData = req.body;

        const orderId = await OrderService.createOrder(orderData);
        const inventory_data = orderData.inventory_data;

        try {
            if (
                orderData.stock_status === "in stock" &&
                inventory_data?.length
            ) {
                for (const inv of inventory_data) {
                    if (inv.quantity_required === 0 || inv.price === 0) {
                        await OrderService.deleteOrder(orderId);
                        return res.status(400).json({
                            message: `Price or quantity required cannot be zero for ${inv.inventory_name}!`,
                        });
                    }
                    const { isAvailabe, previousInventory } =
                        await InventoryService.quantityAvailable(inv);

                    if (!isAvailabe) {
                        await OrderService.deleteOrder(orderId);
                        return res.status(400).json({
                            message: `Insufficient Inventory Item! Not enough quantity is in stock for ${inv.inventory_name}. Required: ${inv.quantity_required}, Available: ${previousInventory.quantity}`,
                            insufficientItem: {
                                name: inv.inventory_name,
                                required: inv.quantity_required,
                                available: previousInventory.quantity,
                            },
                        });
                    }
                    await OrderService.addInventory({
                        operation_id: orderId,
                        ...inv,
                    });
                }
            }

            res.status(201).json({
                message: "Order created successfully!",
                operation_id: orderId,
            });
        } catch (err) {
            // console.log("🚀 ~ createOrder ~ err:", err);
            // If any error occurs during inventory operations, delete the created order
            await OrderService.deleteOrder(orderId);
            throw err;
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const createOrderInventory = async (req, res) => {
    try {
        const { operation_id, type, inventory_data } = req.body;

        // First, validate all inventory quantities
        for (const inv of inventory_data) {
            const isAvailabe = InventoryService.quantityAvailable(inv);

            if (!isAvailabe) {
                OrderService.deleteOrder(operation_id);

                return res.status(400).json({
                    message: `Insufficient Inventory Item! Not enough quantity is in stock for ${inv.inventory_name}. Required: ${inv.quantity_required}, Available: ${previousInventory.quantity}`,
                    insufficientItem: {
                        name: inv.inventory_name,
                        required: inv.quantity_required,
                        available: previousInventory.quantity,
                    },
                });
            }
        }

        // If all quantities are sufficient, proceed with the updates
        for (const inv of inventory_data) {
            const previousInventory = await InventoryService.getById(
                inv.inventory_id
            );
            const newQuantity =
                parseInt(previousInventory.quantity) -
                parseInt(inv.quantity_required);

            await OrderService.addInventory({
                operation_id,
                type,
                ...inv,
            });

            await InventoryService.updateInventoryQuantity({
                inventory_id: previousInventory.inventory_id,
                quantity: newQuantity,
            });
        }

        res.status(201).json({
            message: "Requred inventory assigned successfully!",
            order_id: operation_id,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const { start_date, end_date, sort_by, sort_direction, status } =
            req.query;

        const dateOptions =
            start_date || end_date
                ? {
                      created_at: {
                          ...(start_date && { $gte: start_date }),
                          ...(end_date && { $lte: end_date }),
                      },
                  }
                : {};

        const options = {
            filters: {
                ...dateOptions,
                ...(status && { operation_status: status }),
            },
            sortBy: sort_by,
            sortDirection: sort_by ? sort_direction || "DESC" : undefined,
        };

        const orders = await OrderService.getAllOrders(options);
        res.status(200).json(orders);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order_id = req.params.operation_id;
        const order = await OrderService.getOrderById(order_id);
        // console.log("🚀 ~ getOrderById ~ order:", order);
        let orderInventory;
        if (order.stock_status === "in stock") {
            orderInventory =
                await OperationInventoryService.getOperationInventoryById(
                    order_id,
                    "order"
                );
        }

        res.status(200).json({
            ...order,
            ...(order.stock_status === "in stock" && {
                operation_inventory: orderInventory,
            }),
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { operation_id, inventory_data, ...orderData } = req.body;
        const orderId = operation_id;

        if (orderData.stock_status === "in stock" && inventory_data?.length) {
            for (const inv of inventory_data) {
                if (inv.quantity_required === 0 || inv.price === 0) {
                    return res.status(400).json({
                        message: `Price or quantity required cannot be zero for ${inv.inventory_name}!`,
                    });
                }
                const { isAvailabe, actualInventory } =
                    await InventoryService.quantityAvailable(inv);

                if (!isAvailabe) {
                    return res.status(400).json({
                        message: `Insufficient Inventory Item! Not enough quantity is in stock for ${inv.inventory_name}. Required: ${inv.quantity_required}, Available: ${actualInventory.quantity}`,
                        insufficientItem: {
                            name: inv.inventory_name,
                            required: inv.quantity_required,
                            available: actualInventory.quantity,
                        },
                    });
                }
            }

            await OrderService.deleteOrderInventory(operation_id);

            for (const inv of inventory_data) {
                await OrderService.addInventory({
                    operation_id: orderId,
                    ...inv,
                });
            }
        }

        //update inventory quantity when order is approved
        if (
            orderData.operation_status === "approved" &&
            orderData.approved_at !== null
        ) {
            const previousOpInv =
                await OperationInventoryService.getOperationInventoryById(
                    orderId,
                    "order"
                );

            const orderInfo = await OrderService.getOrderById(orderId);

            // Process inventory items
            for (const inv of previousOpInv) {
                const previousInventory = await InventoryService.getById(
                    inv.inventory_id
                );

                const { isAvailabe, actualInventory } =
                    await InventoryService.quantityAvailable(inv);

                if (!isAvailabe) {
                    return res.status(400).json({
                        message: `Insufficient Inventory Item! Not enough quantity is in stock for ${inv.inventory_name}. Required: ${inv.quantity_required}, Available: ${actualInventory.quantity}`,
                        insufficientItem: {
                            name: inv.inventory_name,
                            required: inv.quantity_required,
                            available: actualInventory.quantity,
                        },
                    });
                }

                if (previousInventory.inventory_id !== "installation") {
                    const newQuantity =
                        parseInt(previousInventory.quantity) -
                        parseInt(inv.quantity_required);

                    await InventoryService.updateInventoryQuantity({
                        inventory_id: previousInventory.inventory_id,
                        quantity: newQuantity,
                    });
                }
            }

            // Calculate total amount from inventory data

            const totalAmount = previousOpInv.reduce((sum, item) => {
                const total = item.quantity_required * item.price;
                const VAT = total * 0.15;

                return sum + total + VAT;
            }, 0);

            // Create remainder for the project
            await remainderService.createRemainder({
                remainder_for: orderId,
                remainder_reason: `Order Invoice - ${orderInfo.operation_name}`,
                user_id: orderInfo.created_by,
                amount: totalAmount,
                type: "order",
                remainder_date: new Date(),
            });
        }

        await OrderService.updateOrder(orderId, orderData);

        res.status(200).json({
            message: "Order updated successfully",
            order_id: orderId,
        });
    } catch (err) {
        console.log("🚀 ~ updateOrder ~ err:", err);
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        await OrderService.deleteOrder(req.body.operation_id);
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

module.exports = {
    createOrder,
    createOrderInventory,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};

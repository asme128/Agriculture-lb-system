const OperationInventoryService = require("../services/operation.inventory.service");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

class OperationInventoryController {
    static async createOperationInventory(req, res, next) {
        try {
            const operationInventory =
                await OperationInventoryService.createOperationInventory(
                    req.body
                );
            res.status(201).json({
                message: "Operation inventory created successfully!",
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllOperationInventory(req, res, next) {
        try {
            const options = QueryBuilder.buildOptions(req);

            const operationInventory =
                await OperationInventoryService.getAllOperationInventory(
                    options
                );
            res.status(200).json(operationInventory);
        } catch (err) {
            next(err);
        }
    }

    static async getAggregateOperationInventory(req, res, next) {
        try {
            const options = QueryBuilder.buildOptions(req);

            const operationInventory =
                await OperationInventoryService.getAggregateOperationInventory(
                    options
                );
            res.status(200).json(operationInventory);
        } catch (err) {
            next(err);
        }
    }

    static async getOperationInventoryById(req, res, next) {
        try {
            const { operation_id, type } = req.params;
            const operationInventory =
                await OperationInventoryService.getOperationInventoryById(
                    operation_id,
                    type
                );
            res.status(200).json(operationInventory);
        } catch (err) {
            next(err);
        }
    }

    static async updateOperationInventory(req, res, next) {
        try {
            const { op_inv_id, type, ...rest } = req.body;

            await OperationInventoryService.updateOperationInventory(
                op_inv_id,
                rest,
                type
            );
            res.status(200).json({
                message: "Operation inventory updated successfully!",
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteOperationInventory(req, res, next) {
        try {
            const { operation_id } = req.params;
            const { type } = req.query;
            await OperationInventoryService.deleteOperationInventory(
                operation_id,
                type
            );
            res.status(200).json({
                message: "Operation inventory deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = OperationInventoryController;

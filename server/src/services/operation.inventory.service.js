const OperationInventory = require("../models/operations.inventory.model");
const CustomError = require("../utils/CustomError");

class OperationInventoryService {
    static async createOperationInventory(operationData) {
        try {
            return await OperationInventory.create(operationData);
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error creating operation inventory"
            );
        }
    }

    static async getAllOperationInventory(options = {}) {
        try {
            return await OperationInventory.findAll(options);
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving operation inventory"
            );
        }
    }

    static async getAggregateOperationInventory(options = {}) {
        try {
            return await OperationInventory.findAggregate(options);
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving operation inventory"
            );
        }
    }

    static async getOperationInventoryById(operation_id, type) {
        try {
            return await OperationInventory.findById(operation_id, type);
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving operation inventory"
            );
        }
    }

    static async getOperationInventoryByOpId(op_inv_id, type) {
        try {
            const opInv = await OperationInventory.findByOpId(op_inv_id, type);
            return opInv;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving operation inventory"
            );
        }
    }

    static async updateOperationInventory(op_inv_id, operationData, type) {
        try {
            return await OperationInventory.update(
                op_inv_id,
                operationData,
                type
            );
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error updating operation inventory"
            );
        }
    }

    static async deleteOperationInventory(operation_id, type) {
        try {
            await OperationInventory.delete(operation_id, type);
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error deleting operation inventory"
            );
        }
    }
}

module.exports = OperationInventoryService;

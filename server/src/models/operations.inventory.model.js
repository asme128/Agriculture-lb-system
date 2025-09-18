const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

class OperationInventory {
    static async create(operationData) {
        try {
            const op_inv_id = uuidv4();
            // Insert operation data
            const [result] = await pool.query(
                `INSERT INTO operation_inventory (
                    op_inv_id, operation_id, type, inventory_id, quantity_required, price, added_date, customized_by
                ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    op_inv_id,
                    operationData.operation_id,
                    operationData.type,
                    operationData.inventory_id,
                    operationData.quantity_required,
                    operationData.price,
                    operationData.added_date,
                    operationData.customized_by,
                ]
            );

            return operationData.operation_id;
        } catch (err) {
            throw new CustomError(
                500,
                "Error creating operation inventory: " + err.message
            );
        }
    }

    static async findAll(options = {}) {
        try {
            let baseQuery = `SELECT opInv.* , inv.inventory_name, op.operation_name , s.user_name as staff_name
             FROM operation_inventory AS opInv JOIN inventory AS inv JOIN operations AS op JOIN staff AS s
             ON opInv.inventory_id = inv.inventory_id AND opInv.operation_id = op.operation_id AND opInv.customized_by = s.user_id WHERE 1=1`;

            const params = [];

            const { query: filteredQuery, params: filterParams } =
                QueryBuilder.buildFilterQuery(
                    baseQuery,
                    options.filters,
                    params
                );

            // Apply sorting
            const finalQuery = QueryBuilder.buildSortQuery(
                filteredQuery,
                options.sortBy,
                options.sortDirection
            );

            const [operationInventory] = await pool.query(
                finalQuery,
                filterParams
            );
            // const [operation] = await pool.query(query, params);/

            // Parse operation_data JSON string
            return operationInventory;
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving operation inventory: " + err.message
            );
        }
    }

    static async findAggregate(options = {}) {
        try {
            let baseQuery = `SELECT opInv.inventory_id , inv.inventory_name , SUM(opInv.quantity_required) as total_quantity_required , SUM(opInv.quantity_required * opInv.price) as total_price
             FROM operation_inventory AS opInv 
             JOIN inventory AS inv ON opInv.inventory_id = inv.inventory_id
             WHERE 1=1`;

            const params = [];

            const { query: filteredQuery, params: filterParams } =
                QueryBuilder.buildFilterQuery(
                    baseQuery,
                    options.filters,
                    params
                );

            const groupedQuery =
                filteredQuery + " GROUP BY opInv.inventory_id ";
            // Apply sorting
            const finalQuery = QueryBuilder.buildSortQuery(
                groupedQuery,
                options.sortBy,
                options.sortDirection
            );

            const [operationInventory] = await pool.query(
                finalQuery,
                filterParams
            );
            // const [operation] = await pool.query(query, params);/

            // Parse operation_data JSON string
            return operationInventory;
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving operation inventory: " + err.message
            );
        }
    }

    static async findById(operation_id, type) {
        try {
            const [operationInv] = await pool.query(
                `SELECT 
                    oinv.*, 
                    inv.*,
                    staff.user_name as staff_name
                FROM operation_inventory AS oinv 
                JOIN inventory AS inv ON oinv.inventory_id = inv.inventory_id 
                LEFT JOIN staff ON oinv.customized_by = staff.user_id 
                WHERE operation_id = ? AND type = ?`,
                [operation_id, type]
            );

            if (!operationInv.length) {
                throw new CustomError(404, `${type} inventory not found`);
            }

            return operationInv;
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving operation inventory: " + err.message
            );
        }
    }
    static async findByOpId(op_inv_id, type) {
        try {
            const [operationInv] = await pool.query(
                `SELECT * FROM operation_inventory WHERE op_inv_id = ? AND type = ?`,
                [op_inv_id, type]
            );

            if (!operationInv.length) {
                throw new CustomError(404, "OperationInventory not found");
            }

            return operationInv[0];
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving operation inventory: " + err.message
            );
        }
    }

    static async update(op_inv_id, operationData, type) {
        try {
            // Filter out undefined or null values
            const validData = Object.entries(operationData).filter(
                ([_, value]) => value !== undefined && value !== null
            );

            if (validData.length === 0) {
                throw new CustomError(400, "No valid data provided for update");
            }

            // Build the SET clause dynamically
            const setClause = validData.map(([key]) => `${key} = ?`).join(", ");

            // Prepare the values array
            const values = validData.map(([_, value]) => value);

            // Add operation_id and type to the values array
            values.push(op_inv_id, type);

            await pool.query(
                `UPDATE operation_inventory SET ${setClause} WHERE op_inv_id = ? AND type = ?`,
                values
            );

            return op_inv_id;
        } catch (err) {
            throw new CustomError(
                500,
                "Error updating operation inventory: " + err.message
            );
        }
    }

    static async delete(operation_id, type) {
        try {
            await pool.query(
                "DELETE FROM operation_inventory WHERE operation_id = ? AND type = ?",
                [operation_id, type]
            );
        } catch (err) {
            throw new CustomError(
                500,
                "Error deleting operation inventory: " + err.message
            );
        }
    }
}

module.exports = OperationInventory;

const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

class Operation {
    static async create(operationData) {
        try {
            const operation_id = uuidv4();

            // Insert operation data
            const [result] = await pool.query(
                `INSERT INTO operations (
                    operation_id,
                    customer_id,
                    operation_name,
                    operation_data,
                    operation_status,
                    payment_status,
                    stock_status,
                    created_by,
                    created_at,
                    approved_by,
                    approved_at,
                    proforma_created,
                    proforma_by,
                    proforma_date,
                    total_cost,
                    note,
                    type
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                [
                    operation_id,
                    operationData.customer_id,
                    operationData.operation_name,
                    JSON.stringify(operationData.operation_data),
                    operationData.operation_status || "pending",
                    operationData.payment_status || "not paid",
                    operationData.stock_status,
                    operationData.created_by,
                    operationData.created_at,
                    operationData.approved_by || null,
                    operationData.approved_at || null,
                    operationData.proforma_created || "0",
                    operationData.proforma_by || null,
                    operationData.proforma_date || null,
                    operationData.total_cost || null,
                    operationData.note || null,
                    operationData.type,
                ]
            );

            return operation_id;
        } catch (err) {
            throw new CustomError(
                500,
                "Error creating operation: " + err.message
            );
        }
    }

    static async findAll(type, options = {}) {
        try {
            let baseQuery = `SELECT * FROM operations AS op JOIN customers AS cu ON op.customer_id = cu.customer_id WHERE 1=1`;
            const params = [];

            const { query: filteredQuery, params: filterParams } =
                QueryBuilder.buildFilterQuery(
                    baseQuery,
                    { type: type, ...options.filters },
                    params
                );

            // Apply sorting
            const finalQuery = QueryBuilder.buildSortQuery(
                filteredQuery,
                options.sortBy,
                options.sortDirection
            );

            const [operation] = await pool.query(finalQuery, filterParams);
            // console.log("🚀 ~ Operation ~ findAll ~ operation:", operation);
            // console.log(
            // "🚀 ~ Operation ~ findAll ~ filterParams:",
            // filterParams
            // );

            // Parse operation_data JSON string
            return operation.map((operation) => ({
                ...operation,
                operation_data: JSON.parse(operation.operation_data || "[]"),
            }));
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving operation: " + err.message
            );
        }
    }

    static async findAllOperation(options = {}) {
        try {
            let baseQuery = `SELECT * FROM operations AS op JOIN customers AS cu ON op.customer_id = cu.customer_id WHERE 1=1`;
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

            const [operation] = await pool.query(finalQuery, filterParams);
            // const [operation] = await pool.query(query, params);/

            // Parse operation_data JSON string
            return operation.map((operation) => ({
                ...operation,
                operation_data: JSON.parse(operation.operation_data || "[]"),
            }));
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving operation: " + err.message
            );
        }
    }

    static async findById(operation_id, type) {
        try {
            const [operation] = await pool.query(
                "SELECT * FROM operations WHERE operation_id = ? AND type = ?",
                [operation_id, type]
            );

            if (!operation.length) {
                return null;
            }

            // Parse operation_data JSON string
            return {
                ...operation[0],
                operation_data: JSON.parse(operation[0].operation_data),
            };
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving operation: " + err.message
            );
        }
    }

    static async update(operation_id, operationData, type) {
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
            const values = validData.map(([key, value]) => {
                // Handle JSON stringification for operation_data
                return key === "operation_data" ? JSON.stringify(value) : value;
            });

            // Add operation_id and type to the values array
            values.push(operation_id, type);
            // // console.log(
            // //     "🚀 ~ Operation ~ update ~     UPDATE ",
            // //     `UPDATE operations SET ${setClause} WHERE operation_id = ? AND type = ?`
            // // );
            // // console.log("🚀 ~ Operation ~ update ~ values:", values);

            const [result] = await pool.query(
                `UPDATE operations SET ${setClause} WHERE operation_id = ? AND type = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, "Operation not found");
            }

            return operation_id;
        } catch (err) {
            throw new CustomError(
                500,
                "Error updating operation: " + err.message
            );
        }
    }

    static async delete(operation_id, type) {
        try {
            await pool.query(
                "DELETE FROM operations WHERE operation_id = ? AND type = ?",
                [operation_id, type]
            );
        } catch (err) {
            throw new CustomError(
                500,
                "Error deleting operation: " + err.message
            );
        }
    }
}

module.exports = Operation;

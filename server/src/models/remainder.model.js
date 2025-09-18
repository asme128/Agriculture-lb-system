const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const QueryBuilder = require("../utils/queryBuilder");

// Remainder Model
class Remainder {
    // Create a new payment entry
    static async create(remainderData) {
        const remainder_id = uuidv4();
        const query = `
            INSERT INTO remainders (
                remainder_id, remainder_for, user_id, amount,
                type, remainder_date, remainder_reason
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            remainder_id,
            remainderData.remainder_for,
            remainderData.user_id,
            remainderData.amount,
            remainderData.type,
            remainderData.remainder_date,
            remainderData.remainder_reason,
        ];

        try {
            await pool.query(query, values);
            return { remainder_id, ...remainderData };
        } catch (error) {
            throw error;
        }
    }

    // Get all payments
    static async findAll(options = {}) {
        try {
            let baseQuery = `SELECT r.*, s.user_name AS staff_name, o.operation_name AS operation_name, c.first_name , c.last_name
            FROM remainders AS r JOIN staff AS s  JOIN operations AS o JOIN customers AS c
            ON r.user_id = s.user_id AND r.remainder_for = o.operation_id AND o.customer_id = c.customer_id
            WHERE 1=1`;
            let params = [];

            // Apply filters
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

            const [rows] = await pool.query(finalQuery, filterParams);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get a remainders by ID
    static async findById(remainder_id) {
        const query = "SELECT * FROM remainders WHERE remainder_id = ?";
        try {
            const [rows] = await pool.query(query, [remainder_id]);
            if (rows.length === 0) {
                throw new Error("Remainder not found");
            }
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get remainders by patient ID
    static async findByPatientId(patient_id) {
        const query = "SELECT * FROM remainders WHERE patient_id = ?";

        try {
            const [results] = await pool.query(query, [patient_id]);
            return results; // Return the first result
        } catch (error) {
            throw new Error(
                `Error fetching remainders of patient: ${error.message}`
            );
        }
    }

    // Update a remainder by ID
    static async update(remainder_id, remainderData) {
        const fields = [];
        const values = [];

        Object.entries(remainderData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        values.push(remainder_id);
        const query = `
            UPDATE remainders 
            SET ${fields.join(", ")}
            WHERE remainder_id = ?
        `;

        try {
            await pool.query(query, values);
            return await this.findById(remainder_id);
        } catch (error) {
            throw error;
        }
    }

    // Delete a remainder by ID
    static async delete(remainder_id) {
        const query = "DELETE FROM remainders WHERE remainder_id = ?";
        try {
            await pool.query(query, [remainder_id]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Remainder;

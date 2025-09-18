const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const QueryBuilder = require("../utils/queryBuilder");

class Expense {
    static async create(expenseData) {
        const expense_id = uuidv4();
        const query = `
            INSERT INTO expenses (
                expense_id, expense_name, expense_reason, expense_amount,
                expense_for, registered_by, type, expense_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            expense_id,
            expenseData.expense_name,
            expenseData.expense_reason,
            expenseData.expense_amount,
            expenseData.expense_for,
            expenseData.registered_by,
            expenseData.type,
            expenseData.expense_date,
        ];

        try {
            await pool.query(query, values);
            return { expense_id, ...expenseData };
        } catch (error) {
            throw error;
        }
    }

    static async findAll(options = {}) {
        try {
            let baseQuery = `SELECT ex.*, o.operation_name , s.user_name AS staff_name
            FROM expenses AS ex LEFT JOIN operations AS o ON ex.expense_for = o.operation_id
             LEFT JOIN staff AS s ON ex.registered_by = s.user_id
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

    static async findById(expense_id) {
        const query = "SELECT * FROM expenses WHERE expense_id = ?";
        try {
            const [rows] = await pool.query(query, [expense_id]);
            if (rows.length === 0) {
                throw new Error("Expense not found");
            }
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(expense_id, expenseData) {
        const fields = [];
        const values = [];

        Object.entries(expenseData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        values.push(expense_id);
        const query = `
            UPDATE expenses 
            SET ${fields.join(", ")}
            WHERE expense_id = ?
        `;

        try {
            await pool.query(query, values);
            return await this.findById(expense_id);
        } catch (error) {
            throw error;
        }
    }

    static async delete(expense_id) {
        const query = "DELETE FROM expenses WHERE expense_id = ?";
        try {
            await pool.query(query, [expense_id]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Expense;

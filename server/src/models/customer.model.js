const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");

class Customer {
    static async create(customerData) {
        try {
            const customer_id = uuidv4();
            const [result] = await pool.query(
                `INSERT INTO customers (
                    customer_id, first_name, last_name, gender, 
                    phone, email, registered_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    customer_id,
                    customerData.first_name,
                    customerData.last_name,
                    customerData.gender,
                    customerData.phone,
                    customerData.email,
                    customerData.registered_by,
                ]
            );

            return customer_id;
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                // Customize the error message for duplicate phone entry
                if (err.sqlMessage.includes("phone")) {
                    throw new Error(
                        "This phone number is already in use. Please use a different one."
                    );
                }
            }
            throw new CustomError(
                500,
                "Error creating customer: " + err.message
            );
        }
    }

    static async findAll(options = {}) {
        try {
            let query = "SELECT * FROM customers WHERE 1=1";
            const params = [];

            // Handle filtering
            if (options.filters) {
                Object.entries(options.filters).forEach(([column, value]) => {
                    if (value !== undefined && value !== null) {
                        if (typeof value === "object") {
                            if (value.$like) {
                                query += ` AND ${column} LIKE ?`;
                                params.push(value.$like);
                            }
                        } else {
                            query += ` AND ${column} = ?`;
                            params.push(value);
                        }
                    }
                });
            }

            // Handle sorting
            if (options.sortBy) {
                const sortDirection =
                    options.sortDirection?.toUpperCase() === "ASC"
                        ? "ASC"
                        : "DESC";
                query += ` ORDER BY ${options.sortBy} ${sortDirection}`;
            }

            const [customers] = await pool.query(query, params);
            return customers;
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving customers: " + err.message
            );
        }
    }

    static async findById(customer_id) {
        try {
            const [customer] = await pool.query(
                "SELECT * FROM customers WHERE customer_id = ?",
                [customer_id]
            );

            if (!customer.length) {
                return null;
                // throw new CustomError(404, "Customer not found");
            }

            return customer[0];
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving customer: " + err.message
            );
        }
    }

    static async update(customer_id, customerData) {
        try {
            // Filter out undefined or null values
            const validData = Object.entries(customerData).filter(
                ([_, value]) => value !== undefined && value !== null
            );

            if (validData.length === 0) {
                throw new CustomError(400, "No valid data provided for update");
            }

            // Build the SET clause dynamically
            const setClause = validData.map(([key]) => `${key} = ?`).join(", ");

            // Prepare the values array
            const values = validData.map(([_, value]) => value);

            // Add customer_id to the values array
            values.push(customer_id);

            const [result] = await pool.query(
                `UPDATE customers SET ${setClause} WHERE customer_id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, "Customer not found");
            }

            return customer_id;
        } catch (err) {
            throw new CustomError(
                500,
                "Error updating customer: " + err.message
            );
        }
    }

    static async delete(customer_id) {
        try {
            const [result] = await pool.query(
                "DELETE FROM customers WHERE customer_id = ?",
                [customer_id]
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, "Customer not found");
            }
        } catch (err) {
            throw new CustomError(
                500,
                "Error deleting customer: " + err.message
            );
        }
    }
}

module.exports = Customer;

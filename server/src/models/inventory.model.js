const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

class Inventory {
    /**
     * Create a new inventory item
     * @param {Object} inventoryData - Data for the new inventory item
     */
    static async create(inventoryData) {
        try {
            // Check for duplicate inventory_id
            const [existingInventory] = await pool.query(
                "SELECT * FROM inventory WHERE inventory_id = ?",
                [inventoryData.inventory_id]
            );

            if (existingInventory.length > 0) {
                throw new CustomError(
                    409,
                    "This inventory item already exists."
                );
            }

            const inventory_id = uuidv4();

            const [result] = await pool.query(
                "INSERT INTO inventory (inventory_id, inventory_name, unit, quantity, buying_price, selling_price, acquired_from) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    inventory_id,
                    inventoryData.inventory_name,
                    inventoryData.unit,
                    inventoryData.quantity,
                    inventoryData.buying_price,
                    inventoryData.selling_price,
                    inventoryData.acquired_from,
                ]
            );

            return {
                id: result.insertId,
                inventory_id,
                ...inventoryData,
            };
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                if (err.sqlMessage.includes("inventory_id")) {
                    throw new CustomError(
                        409,
                        "This inventory ID already exists."
                    );
                }
            }
            throw err;
        }
    }

    static async addRecord(inventoryData) {
        try {
            const insertion_id = uuidv4();

            const [result] = await pool.query(
                "INSERT INTO inventory_in (insertion_id,  inventory_id, insertion_date, user_id, quantity, buying_price) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    insertion_id,
                    inventoryData.inventory_id,
                    new Date(),
                    inventoryData.user_id,
                    inventoryData.quantity,
                    inventoryData.buying_price,
                ]
            );

            return result;
        } catch (err) {
            err;
        }
    }

    static async findAllInventoryRecords(options = {}) {
        try {
            let baseQuery = `SELECT invIn.*, inv.inventory_name, s.user_name AS staff_name
            FROM inventory_in AS invIn LEFT JOIN inventory AS inv  ON invIn.inventory_id = inv.inventory_id
            LEFT JOIN staff AS s ON invIn.user_id = s.user_id WHERE 1=1`;
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

    /**
     * Fetch all inventory items
     */
    static async findAll() {
        try {
            const [results] = await pool.query(
                "SELECT * FROM inventory WHERE is_removed = 0"
            );
            return results;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Model method to find an inventory item by its ID.
     *
     * @param {string} inventoryId - The unique ID of the inventory item to be retrieved.
     * @returns {object|null} The inventory item if found, or `null` if not found.
     * @throws {Error} If there is an issue with the database query.
     */
    static async findById(inventoryId) {
        try {
            // Execute the query to fetch the inventory item by ID
            const [results] = await pool.query(
                "SELECT * FROM inventory WHERE inventory_id = ? AND is_removed = 0",
                [inventoryId]
            );

            // Check if no records were found
            if (results.length === 0) {
                return null; // Return null if the inventory item does not exist
            }

            // Return the first result (assuming inventory_id is unique)
            return results[0];
        } catch (err) {
            // Throw the error to the calling service for further handling
            throw new Error("Database query error: " + err.message);
        }
    }

    static async updateQuantity(inventoryId, quantity) {
        try {
            // Update the quantity in the database
            await pool.query(
                "UPDATE inventory SET quantity = ? WHERE inventory_id = ?",
                [quantity, inventoryId]
            );

            // Return the updated quantity
            return { inventory_id: inventoryId, quantity };
        } catch (err) {
            throw err;
        }
    }

    static async updateInventory(updateData) {
        try {
            // Filter out undefined or null values
            const validData = Object.entries(updateData).filter(
                ([key, value]) =>
                    value !== undefined &&
                    value !== null &&
                    key !== "inventory_id" &&
                    key !== "user_id"
            );

            if (validData.length === 0) {
                throw new Error("No valid data provided for update");
            }

            // Build the SET clause dynamically
            const setClause = validData.map(([key]) => `${key} = ?`).join(", ");

            // Prepare the values array
            const values = validData.map(([_, value]) => value);

            // Add inventory_id to the values array
            values.push(updateData.inventory_id);

            // Perform the update query
            const [result] = await pool.query(
                `UPDATE inventory SET ${setClause} WHERE inventory_id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new Error(
                    "No rows updated. Inventory item may not exist."
                );
            }

            // Fetch and return the updated inventory item
            const [updatedItem] = await pool.query(
                "SELECT * FROM inventory WHERE inventory_id = ?",
                [updateData.inventory_id]
            );

            return updatedItem[0]; // Return the updated inventory record
        } catch (err) {
            throw new Error(
                "Error updating inventory in the database: " + err.message
            );
        }
    }

    static async deleteInventory(inventoryId) {
        try {
            // Execute the DELETE query to remove the inventory item by its ID
            const [result] = await pool.query(
                "DELETE FROM inventory WHERE inventory_id = ?",
                [inventoryId]
            );

            // Check if any rows were affected (i.e., item was actually deleted)
            if (result.affectedRows === 0) {
                throw new Error(
                    `Inventory item with ID ${inventoryId} not found`
                );
            }

            // Return a success message or confirmation
            return { message: "Inventory item deleted successfully" };
        } catch (err) {
            // Rethrow the error with an additional message for debugging
            throw new Error("Error deleting inventory item: " + err.message);
        }
    }
}

module.exports = Inventory;

// Import the Inventory model and custom error handler
const Inventory = require("../models/inventory.model");
const CustomError = require("../utils/CustomError");

class InventoryService {
    /**
     * Method to create a new inventory item.
     * It uses the Inventory model's `create` method to add a new entry to the database.
     * @param {Object} inventoryData - The data for the new inventory item.
     * @returns {Object} - The newly created inventory item.
     * @throws {CustomError} - Throws a custom error if creation fails.
     */
    async createInventory(inventoryData) {
        try {
            // Attempt to create the new inventory item using the provided data
            const newInventory = await Inventory.create(inventoryData);
            return newInventory; // Return the newly created inventory item
        } catch (err) {
            // Handle errors during inventory creation
            throw new CustomError(
                501,
                "Error creating inventory: " + err.message
            );
        }
    }
    async addInventoryRecord(inventoryData) {
        try {
            // Attempt to create the new inventory item using the provided data
            const newInventory = await Inventory.addRecord(inventoryData);
            return newInventory; // Return the newly created inventory item
        } catch (err) {
            // Handle errors during inventory creation
            throw new CustomError(
                501,
                "Error creating inventory: " + err.message
            );
        }
    }

    /**
     * Method to retrieve all inventory data.
     * It uses the Inventory model's `findAll` method to fetch all entries.
     * @returns {Array} - Array of all inventory items.
     * @throws {Error} - Throws a generic error if retrieval fails.
     */
    async getAllInventory() {
        try {
            // Attempt to retrieve all inventory items
            const allInventory = await Inventory.findAll();
            return allInventory; // Return the array of inventory items
        } catch (err) {
            // Handle errors during inventory retrieval
            throw new Error("Error retrieving all inventory: " + err.message);
        }
    }

    async updateQuantity(inventoryId, quantity) {
        try {
            // Fetch the inventory item by ID
            const inventoryItem = await Inventory.findById(inventoryId);
            if (!inventoryItem) {
                throw new CustomError(404, "Inventory item not found");
            }

            // Update the quantity in the database
            const updatedInventory = await Inventory.updateQuantity(
                inventoryId,
                quantity
            );

            // Return the updated inventory
            return updatedInventory;
        } catch (err) {
            throw new CustomError(
                500,
                "Error updating quantity: " + err.message
            );
        }
    }

    /**
     * Service method to update an inventory item.
     * - Checks if the inventory item exists by its ID.
     * - Calls the model layer to update the inventory item with the provided data.
     * - Returns the updated inventory item or throws an error if something goes wrong.
     *
     * @param {string} inventoryId - The unique ID of the inventory item to update.
     * @param {Object} updateData - The data to update the inventory item with.
     * @returns {Promise<Object>} - The updated inventory item.
     * @throws {Error} - Throws an error if the inventory item does not exist or the update fails.
     */
    async updateInventory(updateData) {
        try {
            // Check if the inventory item exists by its ID
            const inventoryItem = await Inventory.findById(
                updateData.inventory_id
            );
            if (!inventoryItem) {
                throw new Error("Inventory item not found"); // Descriptive error message
            }

            // Perform the update operation via the model layer
            const updatedInventory = await Inventory.updateInventory(
                updateData
            );

            // Return the updated inventory item
            return {
                updatedInventory: updatedInventory,
                previousInventory: inventoryItem,
            };
        } catch (err) {
            // Catch and re-throw errors with a clear error message
            throw new Error("Error updating inventory item: " + err.message);
        }
    }

    async updateInventoryQuantity(updateData) {
        try {
            // Check if the inventory item exists by its ID
            const inventoryItem = await Inventory.findById(
                updateData.inventory_id
            );
            if (!inventoryItem) {
                throw new Error("Inventory item not found"); // Descriptive error message
            }

            // Perform the update operation via the model layer
            const updatedInventory = await Inventory.updateQuantity(
                updateData.inventory_id,
                updateData.quantity
            );
            // Return the updated inventory item
            return updatedInventory;
        } catch (err) {
            // Catch and re-throw errors with a clear error message
            throw new Error("Error updating inventory item: " + err.message);
        }
    }

    async deleteInventory(inventoryId) {
        try {
            // Check if the inventory item exists by finding it by ID
            const inventoryItem = await Inventory.findById(inventoryId);

            // If the inventory item does not exist, throw an error
            if (!inventoryItem) {
                throw new Error("Inventory item not found");
            }

            // Remove the inventory item
            await Inventory.updateInventory({
                inventory_id: inventoryId,
                is_removed: true,
            });

            // Optionally, return a success message or confirmation of deletion
            return { message: "Inventory item deleted successfully" };
        } catch (err) {
            // Throw a detailed error with the original error message
            throw new Error("Error deleting inventory item: " + err.message);
        }
    }

    /**
     * Service method to fetch an inventory item by its ID.
     *
     * @param {string} inventoryId - The unique ID of the inventory item.
     * @returns {object} The inventory item data if found.
     * @throws {CustomError} If the inventory item is not found or an error occurs during the operation.
     */
    async getById(inventoryId) {
        try {
            // Fetch the inventory item from the database by ID
            const inventory = await Inventory.findById(inventoryId);

            // Check if the inventory item exists
            if (!inventory) {
                throw new CustomError(404, "Inventory item not found");
            }

            // Return the inventory item data
            return inventory;
        } catch (err) {
            // Throw a new error with additional context if an error occurs
            throw new CustomError(
                err.statusCode || 500,
                "Error retrieving inventory item: " + err.message
            );
        }
    }

    async quantityAvailable(inv) {
        try {
            // Fetch the inventory item from the database by ID
            const actualInventory = await Inventory.findById(inv.inventory_id);

            // Check if the inventory item exists
            if (!actualInventory) {
                throw new CustomError(404, "Inventory item not found");
            }
            const newQuantity =
                parseInt(actualInventory.quantity) -
                parseInt(inv.quantity_required);

            // Return the inventory item data

            return {
                isAvailabe: newQuantity >= 0,
                actualInventory: actualInventory,
            };
        } catch (err) {
            // Throw a new error with additional context if an error occurs
            throw new CustomError(
                err.statusCode || 500,
                "Error retrieving inventory item: " + err.message
            );
        }
    }

    async getAllRecords(options) {
        try {
            const records = await Inventory.findAllInventoryRecords(options);
            return records;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving records"
            );
        }
    }
}

module.exports = new InventoryService(); // Export the instance of InventoryService

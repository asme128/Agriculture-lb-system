// Import required services and utilities
const inventoryService = require("../services/inventory.service");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

/**
 * Create a new inventory item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createInventory = async (req, res) => {
    try {
        // Extract inventory data from the request body
        const inventoryData = req.body;

        // Call the service to create the new inventory item
        const newInventory = await inventoryService.createInventory(
            inventoryData
        );

        await inventoryService.addInventoryRecord(newInventory);
        // Respond with the newly created inventory item and success message
        res.status(201).json({
            result: newInventory,
            message: "Inventory item created successfully!",
        });
    } catch (err) {
        // Handle errors and respond with appropriate status code and message
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

/**
 * Get all inventory items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getAllInventory = async (req, res) => {
    try {
        // Call the service to fetch all inventory items
        const allInventory = await inventoryService.getAllInventory();

        // Respond with the retrieved inventory items
        res.status(200).json(allInventory);
    } catch (err) {
        // Handle errors and respond with appropriate status code and message
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

/**
 * update quantity for each items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateQuantity = async (req, res) => {
    try {
        // Extract the inventory_id from URL params and quantity from the request body
        const inventoryId = req.params.inventory_id;
        const { quantity } = req.body;

        // Call the service method to update the quantity
        const updatedInventory = await inventoryService.updateQuantity(
            inventoryId,
            quantity
        );

        // Respond with the updated inventory
        res.status(200).json({
            message: "Quantity updated successfully",
            updatedInventory,
        });
    } catch (err) {
        // Handle errors and send an appropriate response
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

/**
 * Controller method to update an inventory item.
 * - Retrieves the inventory ID from the request parameters.
 * - Extracts the update data from the request body.
 * - Calls the service layer to perform the update.
 * - Responds with the updated inventory item or an error message.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const updateInventory = async (req, res) => {
    try {
        // Extract the inventory ID from the URL parameters
        // const inventoryId = req.params.inventory_id; // Ensure parameter name matches the route

        // Extract the update data from the request body
        const updateData = req.body;

        // Call the service layer to update the inventory item
        const returnedData = await inventoryService.updateInventory(updateData);

        const newQuantity =
            parseFloat(updateData.quantity) -
            parseFloat(returnedData.previousInventory.quantity);

        if (newQuantity > 0) {
            await inventoryService.addInventoryRecord({
                ...updateData,
                quantity: newQuantity,
            });
        } else {
            await inventoryService.addInventoryRecord(updateData);
        }
        // Respond with the updated inventory item
        res.status(200).json({
            message: "Inventory item updated successfully.",
            data: returnedData.updatedInventory,
        });
    } catch (err) {
        // Handle errors and send appropriate error response
        res.status(err.statusCode || 500).json({
            message:
                err.message ||
                "An error occurred while updating the inventory item.",
        });
    }
};

const findAllInventoryRecords = async (req, res) => {
    try {
        const options = QueryBuilder.buildOptions(req);
        const records = await inventoryService.getAllRecords(options);

        res.status(200).json(records);
    } catch (err) {
        console.error("Error in Records: ", err.message);
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const deleteInventory = async (req, res) => {
    try {
        // Extract the inventory ID from the request parameters
        const inventoryId = req.body.inventory_id;

        // Check if the inventory ID is provided
        if (!inventoryId) {
            return res
                .status(400)
                .json({ message: "Inventory ID is required." });
        }

        // Call the service to delete the inventory item by ID
        const result = await inventoryService.deleteInventory(inventoryId);

        // If no inventory item is found to delete, return a 404 error
        if (!result) {
            return res
                .status(404)
                .json({ message: "Inventory item not found." });
        }

        // Return a 204 No Content status if deletion is successful
        res.status(200).json({ message: "Inventory deleted successfully" }); // No content
    } catch (err) {
        // Handle errors and send an appropriate response
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

/**
 * Controller to fetch a single inventory item by its ID.
 *
 * @param {object} req - The request object containing parameters (inventory_id).
 * @param {object} res - The response object used to send back the result or error.
 */
const findById = async (req, res) => {
    try {
        // Extract the inventory ID from the request parameters
        const inventoryId = req.params.inventory_id;

        // Fetch the inventory data using the service
        const inventory = await inventoryService.getById(inventoryId);

        // If the inventory item is not found, return a 404 response
        if (!inventory) {
            return res
                .status(404)
                .json({ message: "Inventory item not found." });
        }

        // Respond with the retrieved inventory data and a success status
        res.status(200).json(inventory);
    } catch (err) {
        // Log the error and send a proper error response
        console.error("Error fetching inventory by ID:", err.message);
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

// Export all controller functions
module.exports = {
    createInventory,
    getAllInventory,
    findAllInventoryRecords,
    updateQuantity,
    updateInventory,
    deleteInventory,
    findById,
};

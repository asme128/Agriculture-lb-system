const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

class Bid {
    /**
     * Create a new bid entry
     * @param {Object} bidData - Data for the new bid entry
     */
    static async create(bidData) {
        try {
            const bid_id = uuidv4();

            const [result] = await pool.query(
                "INSERT INTO bids (bid_id, bid_by, bid_data, bid_date, registered_by) VALUES (?, ?, ?, ?, ?)",
                [
                    bid_id,
                    bidData.bid_by,
                    JSON.stringify(bidData.bid_data),
                    bidData.bid_date,
                    bidData.registered_by,
                ]
            );

            return {
                id: result.insertId,
                bid_id,
                ...bidData,
            };
        } catch (err) {
            throw new CustomError(500, "Error creating bid: " + err.message);
        }
    }

    /**
     * Find all bids with optional filtering and sorting
     * @param {Object} options - Filtering and sorting options
     */
    static async findAll(options = {}) {
        try {
            let baseQuery = `SELECT v.*, c.first_name, c.last_name, c.gender, s.user_name AS staff_name 
            FROM bids AS v JOIN customers AS c JOIN staff AS s 
            ON v.bid_by = c.customer_id AND v.registered_by = s.user_id
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

            const [bids] = await pool.query(finalQuery, filterParams);
            return bids.map((bid) => ({
                ...bid,
                bid_data: JSON.parse(bid.bid_data || "[]"),
            }));
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find a bid by ID
     * @param {string} bidId - ID of the bid
     */
    static async findById(bidId) {
        try {
            const [results] = await pool.query(
                "SELECT * FROM bids WHERE bid_id = ?",
                [bidId]
            );

            if (results.length === 0) {
                return null;
            }

            return {
                ...results[0],
                bid_data: JSON.parse(results[0].bid_data || "[]"),
            };
        } catch (err) {
            throw new CustomError(500, "Error retrieving bid: " + err.message);
        }
    }

    /**
     * Update a bid entry
     * @param {string} bidId - ID of the bid
     * @param {Object} bidData - Data to update the bid entry
     */
    static async updateBid(bidId, bidData) {
        try {
            // Filter out undefined or null values
            const validData = Object.entries(bidData).filter(
                ([_, value]) => value !== undefined && value !== null
            );

            if (validData.length === 0) {
                throw new CustomError(400, "No valid data provided for update");
            }

            // Build the SET clause dynamically
            const setClause = validData.map(([key]) => `${key} = ?`).join(", ");

            // Prepare the values array
            const values = validData.map(([_, value]) => value);

            // Add bidId to the values array
            values.push(bidId);

            const [result] = await pool.query(
                `UPDATE bids SET ${setClause} WHERE bid_id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, "Bid not found or no changes made");
            }

            const [updatedBid] = await pool.query(
                "SELECT * FROM bids WHERE bid_id = ?",
                [bidId]
            );

            return updatedBid[0];
        } catch (err) {
            throw new CustomError(500, "Error updating bid: " + err.message);
        }
    }

    /**
     * Delete a bid entry
     * @param {string} bidId - ID of the bid
     */
    static async deleteBid(bidId) {
        try {
            const [result] = await pool.query(
                "DELETE FROM bids WHERE bid_id = ?",
                [bidId]
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, `Bid  not found`);
            }

            return { message: "Bid deleted successfully" };
        } catch (err) {
            throw new CustomError(500, "Error deleting bid: " + err.message);
        }
    }
}

module.exports = Bid;

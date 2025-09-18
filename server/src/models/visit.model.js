const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

class Visit {
    /**
     * Create a new visit entry
     * @param {Object} visitData - Data for the new visit entry
     */
    static async create(visitData) {
        try {
            const visit_id = uuidv4();

            const [result] = await pool.query(
                "INSERT INTO visits (visit_id, visit_by, visit_data, visit_date, registered_by) VALUES (?, ?, ?, ?, ?)",
                [
                    visit_id,
                    visitData.visit_by,
                    JSON.stringify(visitData.visit_data),
                    visitData.visit_date,
                    visitData.registered_by,
                ]
            );

            return {
                id: result.insertId,
                visit_id,
                ...visitData,
            };
        } catch (err) {
            throw new CustomError(500, "Error creating visit: " + err.message);
        }
    }

    /**
     * Find all visits with optional filtering and sorting
     * @param {Object} options - Filtering and sorting options
     */
    static async findAll(options = {}) {
        try {
            let baseQuery = `SELECT v.*, c.first_name, c.last_name, c.gender, s.user_name AS staff_name 
            FROM visits AS v JOIN customers AS c JOIN staff AS s 
            ON v.visit_by = c.customer_id AND v.registered_by = s.user_id
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

            const [visits] = await pool.query(finalQuery, filterParams);
            return visits.map((visit) => ({
                ...visit,
                visit_data: JSON.parse(visit.visit_data || "[]"),
            }));
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find a visit by ID
     * @param {string} visitId - ID of the visit
     */
    static async findById(visitId) {
        try {
            const [results] = await pool.query(
                "SELECT * FROM visits WHERE visit_id = ?",
                [visitId]
            );

            if (results.length === 0) {
                return null;
            }

            return {
                ...results[0],
                visit_data: JSON.parse(results[0].visit_data || "[]"),
            };
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving visit: " + err.message
            );
        }
    }

    /**
     * Update a visit entry
     * @param {string} visitId - ID of the visit
     * @param {Object} visitData - Data to update the visit entry
     */
    static async updateVisit(visitId, visitData) {
        try {
            // Filter out undefined or null values
            const validData = Object.entries(visitData).filter(
                ([_, value]) => value !== undefined && value !== null
            );

            if (validData.length === 0) {
                throw new CustomError(400, "No valid data provided for update");
            }

            // Build the SET clause dynamically
            const setClause = validData.map(([key]) => `${key} = ?`).join(", ");

            // Prepare the values array
            const values = validData.map(([_, value]) => value);

            // Add visitId to the values array
            values.push(visitId);

            const [result] = await pool.query(
                `UPDATE visits SET ${setClause} WHERE visit_id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new CustomError(
                    404,
                    "Visit not found or no changes made"
                );
            }

            const [updatedVisit] = await pool.query(
                "SELECT * FROM visits WHERE visit_id = ?",
                [visitId]
            );

            return updatedVisit[0];
        } catch (err) {
            throw new CustomError(500, "Error updating visit: " + err.message);
        }
    }

    /**
     * Delete a visit entry
     * @param {string} visitId - ID of the visit
     */
    static async deleteVisit(visitId) {
        try {
            const [result] = await pool.query(
                "DELETE FROM visits WHERE visit_id = ?",
                [visitId]
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, `Visit  not found`);
            }

            return { message: "Visit deleted successfully" };
        } catch (err) {
            throw new CustomError(500, "Error deleting visit: " + err.message);
        }
    }
}

module.exports = Visit;

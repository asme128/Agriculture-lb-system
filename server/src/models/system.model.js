const pool = require("../config/db");
const CustomError = require("../utils/CustomError");

class System {
    static async updateForms(formData) {
        try {
            // Filter out undefined or null values
            const validData = Object.entries(formData).filter(
                ([_, value]) => value !== undefined && value !== null
            );

            if (validData.length === 0) {
                throw new CustomError(400, "No valid data provided for update");
            }

            // Build the SET clause dynamically
            const setClause = validData.map(([key]) => `${key} = ?`).join(", ");

            // Prepare the values array
            const values = validData.map(([_, value]) => JSON.stringify(value));

            const [result] = await pool.query(
                `UPDATE \`system\` SET ${setClause} WHERE system_id = 'fc2cb043-216b-11f0-9757-50ebf630c639'`,
                values
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, "System configuration not found");
            }

            return true;
        } catch (err) {
            throw new CustomError(
                500,
                "Error updating system configuration: " + err.message
            );
        }
    }

    static async getForms() {
        try {
            const [system] = await pool.query(
                "SELECT * FROM `system` WHERE system_id = 'fc2cb043-216b-11f0-9757-50ebf630c639'"
            );

            if (!system.length) {
                throw new CustomError(404, "System configuration not found");
            }

            const projectForm = JSON.parse(system[0].project_form);
            const orderForm = JSON.parse(system[0].order_form);
            const bidForm = JSON.parse(system[0].bid_form);
            const visitForm = JSON.parse(system[0].visit_form);

            return {
                ...system[0],
                project_form: projectForm,
                order_form: orderForm,
                bid_form: bidForm,
                visit_form: visitForm,
            };
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving system configuration: " + err.message
            );
        }
    }
}

module.exports = System;

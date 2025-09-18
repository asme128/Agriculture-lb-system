const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const CustomError = require("../utils/CustomError");

class Staff {
    static async create(staffData) {
        try {
            const user_id = uuidv4();

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(
                staffData.user_password,
                salt
            );

            const [result] = await pool.query(
                `INSERT INTO staff (
                    user_id, staff_id, role_id, user_name, 
                    user_password, gender, phone
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    user_id,
                    staffData.staff_id,
                    staffData.role_id,
                    staffData.user_name,
                    hashedPassword,
                    staffData.gender,
                    staffData.phone,
                ]
            );

            return { user_id, ...staffData };
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                // Customize the error message for duplicate phone entry
                if (err.sqlMessage.includes("phone")) {
                    throw new Error(
                        "This phone number is already in use. Please use a different one."
                    );
                }
                // Customize the error message for duplicate staff_id
                if (err.sqlMessage.includes("staff_id")) {
                    throw new Error(
                        "This staff ID already exists. Please use a different one."
                    );
                }
            }
            throw err;
        }
    }

    static async findAll() {
        try {
            const [staff] = await pool.query(
                "SELECT user_id, staff_id, role_id, user_name, gender, phone FROM staff WHERE role_id != '1'"
            );
            return staff;
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving staff: " + err.message
            );
        }
    }

    static async countCustomersToday(user_id) {
        const query = `SELECT COUNT(DISTINCT v.registered_by) AS total_customers, s.user_id  
        FROM visits AS v 
        JOIN staff AS s ON v.registered_by = s.user_id 
        WHERE s.user_id = ? AND DATE(v.visit_date) = CURDATE()`;

        try {
            const [results] = await pool.query(query, [user_id]);

            return results[0]?.total_customers || 0; // Return count or 0 if no results
        } catch (error) {
            throw new Error(
                `Error counting patients for today: ${error.message}`
            );
        }
    }

    // Count total patients served for the current month
    static async countCustomersThisMonth(user_id) {
        const query = `SELECT COUNT(DISTINCT v.registered_by) AS total_customers, s.user_id  FROM visits AS v JOIN staff AS s 
        ON v.registered_by = s.user_id
        WHERE s.user_id = ? AND MONTH(visit_date) = MONTH(CURDATE()) AND YEAR(visit_date) = YEAR(CURDATE())`;

        try {
            const [results] = await pool.query(query, [user_id]);
            return results[0]?.total_customers || 0; // Return count or 0 if no results
        } catch (error) {
            throw new Error(
                `Error counting patients for this month: ${error.message}`
            );
        }
    }

    // Count total patients served for the current week
    static async countCustomersThisWeek(user_id) {
        const query = `SELECT COUNT(DISTINCT v.registered_by) AS total_customers, s.user_id  FROM visits AS v JOIN staff AS s 
        ON v.registered_by = s.user_id WHERE s.user_id = ? AND YEARWEEK(visit_date, 1) = YEARWEEK(CURDATE(), 1)`;

        try {
            const [results] = await pool.query(query, [user_id]);
            return results[0]?.total_customers || 0; // Return count or 0 if no results
        } catch (error) {
            throw new Error(
                `Error counting patients for this week: ${error.message}`
            );
        }
    }

    // Count total patients served for the current year
    static async countCustomersThisYear(user_id) {
        const query = `SELECT COUNT(DISTINCT v.registered_by) AS total_customers, s.user_id  FROM visits AS v JOIN staff AS s 
        ON v.registered_by = s.user_id
        WHERE s.user_id = ? AND YEAR(visit_date) = YEAR(CURDATE())`;

        try {
            const [results] = await pool.query(query, [user_id]);
            return results[0]?.total_customers || 0; // Return count or 0 if no results
        } catch (error) {
            throw new Error(
                `Error counting patients for this year: ${error.message}`
            );
        }
    }

    static async countCustomersTotal(user_id) {
        const query = `SELECT COUNT(DISTINCT v.registered_by) AS total_customers, s.user_id  FROM visits AS v JOIN staff AS s 
        ON v.registered_by = s.user_id WHERE s.user_id = ? ;`;

        try {
            const [results] = await pool.query(query, [user_id]);
            return results[0]?.total_customers || 0; // Return count or 0 if no results
        } catch (error) {
            throw new Error(
                `Error counting patients for this year: ${error.message}`
            );
        }
    }

static async findById(staff_id) {
    try {
        const [rows] = await pool.query(
            `SELECT 
                s.user_id,
                s.auth_id,
                s.user_name AS username,
                GROUP_CONCAT(DISTINCT r.name) AS roles,
                GROUP_CONCAT(DISTINCT p.name) AS permissions,
                GROUP_CONCAT(DISTINCT c.name) AS components
            FROM staff s
            LEFT JOIN staff_roles sr ON s.user_id = sr.user_id
            LEFT JOIN roles r ON sr.role_id = r.role_id
            LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.permission_id
            LEFT JOIN component_access ca ON s.user_id = ca.user_id
            LEFT JOIN components c ON ca.component_id = c.component_id
            WHERE s.staff_id = ?`,
            [staff_id]
        );
        if (!rows.length) {
            throw new Error('Staff not found');
        }

        const staff = rows[0];
        return {
            user_id: staff.user_id,
            auth_id: staff.auth_id,
            username: staff.username,
            roles: staff.roles ? staff.roles.split(',') : [],
            permissions: staff.permissions ? staff.permissions.split(',') : [],
            components: staff.components ? staff.components.split(',') : []
        };
    } catch (err) {
        throw err;
    }
}


    static async findByUserId(user_id) {
        try {
            const [staff] = await pool.query(
                "SELECT user_id, staff_id, auth_id, user_name, gender, phone FROM staff WHERE user_id = ?",
                [user_id]
            );

            if (!staff.length) {
                throw new CustomError(404, "Staff not found");
            }

            return staff[0];
        } catch (err) {
            throw new CustomError(
                500,
                "Error retrieving staff: " + err.message
            );
        }
    }

    static async update(user_id, staffData) {
        try {
            const validData = Object.entries(staffData).filter(
                ([key, value]) =>
                    value !== undefined &&
                    value !== null &&
                    key !== "user_password"
            );

            if (validData.length === 0) {
                throw new CustomError(400, "No valid data provided for update");
            }

            const setClause = validData.map(([key]) => `${key} = ?`).join(", ");
            const values = validData.map(([_, value]) => value);
            values.push(user_id);

            const [result] = await pool.query(
                `UPDATE staff SET ${setClause} WHERE user_id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, "Staff not found");
            }

            return user_id;
        } catch (err) {
            throw new CustomError(500, "Error updating staff: " + err.message);
        }
    }

    static async updatePassword(user_id, currentPassword, newPassword) {
        try {
            // Verify current password
            const [staff] = await pool.query(
                "SELECT user_password FROM staff WHERE user_id = ?",
                [user_id]
            );

            if (!staff.length) {
                throw new CustomError(404, "Staff not found");
            }

            const isMatch = await bcrypt.compare(
                currentPassword,
                staff[0].user_password
            );

            if (!isMatch) {
                throw new CustomError(400, "Current password is incorrect");
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            const [result] = await pool.query(
                "UPDATE staff SET user_password = ? WHERE user_id = ?",
                [hashedPassword, user_id]
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, "Staff not found");
            }

            return user_id;
        } catch (err) {
            throw new CustomError(
                500,
                "Error updating password: " + err.message
            );
        }
    }

    static async delete(user_id) {
        try {
            const [result] = await pool.query(
                "DELETE FROM staff WHERE user_id = ?",
                [user_id]
            );

            if (result.affectedRows === 0) {
                throw new CustomError(404, "Staff not found");
            }
        } catch (err) {
            throw new CustomError(500, "Error deleting staff: " + err.message);
        }
    }

static async verifyPassword(user_id, password) {
    try {
        const [rows] = await pool.query(
            "SELECT user_password FROM staff WHERE user_id = ?",
            [user_id]
        );

        if (!rows.length) {
            throw new CustomError(404, "Staff not found");
        }

        const storedHash = rows[0].user_password;

        const isMatch = await bcrypt.compare(password, storedHash);
        console.log("Password match result:", isMatch);

        return isMatch;
    } catch (err) {
        throw new CustomError(
            500,
            "Error verifying password: " + err.message
        );
    }
}

}

module.exports = Staff;

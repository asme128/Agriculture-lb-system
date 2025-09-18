const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");
class Person {
    /**
     * Create a new person entry
     * @param {Object} personData - Data for the new person entry
     */
    static async create(personData, landData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const farmer_id = uuidv4();
      const land_id = uuidv4();

      // Insert into persons table
      await connection.query(
        `INSERT INTO persons (
          farmer_id, first_name, second_name, last_name, gender, marital_status,
          date_birth, phone, optional_phone, id_number, region, zone, woreda, kebele,
          email, personal_profile, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
        [
          farmer_id,
          personData.first_name,
          personData.second_name,
          personData.last_name,
          personData.gender,
          personData.marital_status,
          personData.date_birth,
          personData.phone,
          personData.optional_phone,
          personData.id_number,
          personData.region,
          personData.zone,
          personData.woreda,
          personData.kebele,
          personData.email,
          personData.personal_profile
        ]
      );

      // Insert into land_information table
      await connection.query(
        `INSERT INTO land_information (
          land_id, farmer_id, total_area, book_number, soil_type,
          woreda, kebele, address, land_file, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
        [
          land_id,
          farmer_id,
          landData.total_area,
          landData.book_number,
          landData.soil_type,
          landData.woreda,
          landData.kebele,
          landData.address,
          landData.land_file
        ]
      );

      await connection.commit();

      return { farmer_id, land_id };
    } catch (err) {
      await connection.rollback();
      throw new CustomError(500, "Error creating person and land: " + err.message);
    } finally {
      connection.release();
    }
  }

    static async findAll(options = {}) {
        try {
            let baseQuery = `SELECT pay.*, o.operation_name , o.type, o.payment_status , s.user_name AS staff_name
            FROM payments AS pay JOIN operations AS o JOIN staff AS s 
            ON pay.payment_for = o.operation_id AND pay.registered_by = s.user_id WHERE 1=1`;
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

    static async findAllProfits(options = {}) {
        try {
            let baseQuery = `SELECT  o.operation_id, o.type, o.operation_name,  o.payment_status,  p.total_amount, e.total_expenses 
            FROM operations AS o JOIN
            (SELECT payment_for, SUM(amount) AS total_amount FROM payments GROUP BY payment_for) AS p 
            ON p.payment_for = o.operation_id JOIN 
            (SELECT expense_for, SUM(expense_amount) AS total_expenses FROM expenses WHERE expense_date >= ? AND expense_date <= ? GROUP BY expense_for ) 
            AS e ON e.expense_for = o.operation_id WHERE 1=1 AND o.payment_status IN (?,?) `;
            let params = [];

            // Apply filters
            const { query: filteredQuery, params: filterParams } =
                QueryBuilder.buildFilterQuery(
                    baseQuery,
                    options.filters,
                    params
                );

            const groupedQuery = baseQuery;
            // Apply sorting
            const finalQuery = QueryBuilder.buildSortQuery(
                groupedQuery,
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
     * Fetch a payment entry by ID
     * @param {string} paymentId - ID of the payment
     */
    static async findById(paymentId) {
        try {
            const [results] = await pool.query(
                "SELECT * FROM payments WHERE payment_id = ?",
                [paymentId]
            );

            if (results.length === 0) {
                return null; // Payment not found
            }

            return results[0]; // Return the payment record
        } catch (err) {
            throw new Error("Error retrieving payment by ID: " + err.message);
        }
    }

    /**
     * Update a payment entry
     * @param {Object} paymentData - Data to update the payment entry
     */
    static async updatePayment(paymentId, paymentData) {
        try {
            // Filter out undefined or null values
            const validData = Object.entries(paymentData).filter(
                ([_, value]) => value !== undefined && value !== null
            );

            if (validData.length === 0) {
                throw new CustomError(400, "No valid data provided for update");
            }

            // Build the SET clause dynamically
            const setClause = validData.map(([key]) => `${key} = ?`).join(", ");

            // Prepare the values array
            const values = validData.map(([_, value]) => value);

            // Add paymentId to the values array
            values.push(paymentId);

            const [result] = await pool.query(
                `UPDATE payments SET ${setClause} WHERE payment_id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                throw new CustomError(
                    404,
                    "Payment not found or no changes made."
                );
            }

            const [updatedPayment] = await pool.query(
                "SELECT * FROM payments WHERE payment_id = ?",
                [paymentId]
            );

            return updatedPayment[0];
        } catch (err) {
            throw new Error("Error updating payment: " + err.message);
        }
    }

    static async getDailyRevenue(
        start_day,
        end_day,
        current_month,
        current_year
    ) {
        const query = `
      SELECT WEEKDAY(payment_date) AS date, SUM(amount) AS total_amount
      FROM payments
      WHERE
       MONTH(payment_date) = ? 
        AND YEAR(payment_date) = ?
        AND WEEKDAY(payment_date) BETWEEN ? AND ?
      GROUP BY WEEKDAY(payment_date)
      ORDER BY WEEKDAY(payment_date) ASC;
    `;

        try {
            const [results] = await pool.query(query, [
                current_month,
                current_year,
                start_day,
                end_day,
            ]);
            return results;
        } catch (error) {
            throw new Error(`Error fetching daily revenue: ${error.message}`);
        }
    }

    // Get monthly revenue for a hospital
    static async getMonthlyRevenue(start_month, end_month, current_year) {
        // // console.log(
        // // '🚀 ~ Payment ~ getMonthlyRevenue ~ hospital_id, start_month, end_month, current_year:',
        // // hospital_id,
        // // start_month,
        // // end_month,
        // // current_year
        // // );
        const query = `
      SELECT MONTH(payment_date) AS month, SUM(amount) AS total_amount
      FROM payments
      WHERE YEAR(payment_date) = ? 
        AND MONTH(payment_date) BETWEEN ? AND ?
      GROUP BY MONTH(payment_date)
      ORDER BY MONTH(payment_date) ASC;
    `;

        try {
            const [results] = await pool.query(query, [
                current_year,
                start_month,
                end_month,
            ]);
            return results;
        } catch (error) {
            throw new Error(`Error fetching monthly revenue: ${error.message}`);
        }
    }

    // Get yearly revenue for a hospital
    static async getYearlyRevenue(start_year, end_year) {
        const query = `
      SELECT YEAR(payment_date) AS year, SUM(amount) AS total_amount
      FROM payments
      WHERE YEAR(payment_date) BETWEEN ? AND ?
      GROUP BY YEAR(payment_date)
      ORDER BY YEAR(payment_date) ASC;
    `;

        try {
            const [results] = await pool.query(query, [start_year, end_year]);
            return results;
        } catch (error) {
            throw new Error(`Error fetching yearly revenue: ${error.message}`);
        }
    }

    /**
     * Delete a payment entry
     * @param {string} paymentId - ID of the payment
     */
    static async deletePayment(paymentId) {
        try {
            const [result] = await pool.query(
                "DELETE FROM payments WHERE payment_id = ?",
                [paymentId]
            );

            if (result.affectedRows === 0) {
                throw new CustomError(
                    404,
                    `Payment with ID ${paymentId} not found`
                );
            }

            return { message: "Payment deleted successfully" };
        } catch (err) {
            throw new Error("Error deleting payment: " + err.message);
        }
    }

    /**
     * Fetch all payment entries
     */
}

module.exports = Person;

// Import required services and utilities
const personService = require("../services/person.service");
const QueryBuilder = require("../utils/queryBuilder");

/**
 * Create a new payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createPerson = async (req, res) => {
    try {
    const personal_profile = req.files?.personal_profile?.[0]?.filename || null;
    const land_file = req.files?.land_file?.[0]?.filename || null;

    const personData = {
      first_name: req.body.first_name,
      second_name: req.body.second_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      marital_status: req.body.marital_status,
      date_birth: req.body.date_birth,
      phone: req.body.phone,
      optional_phone: req.body.optional_phone,
      id_number: req.body.id_number,
      region: req.body.region,
      zone: req.body.zone,
      woreda: req.body.woreda,
      kebele: req.body.kebele,
      email: req.body.email,
      personal_profile,
    };

    const landData = {
      total_area: req.body.total_area,
      book_number: req.body.book_number,
      soil_type: req.body.soil_type,
      woreda: req.body.land_woreda,
      kebele: req.body.land_kebele,
      address: req.body.land_address,
      land_file,
    };


    const result = await personService.createPerson(personData, landData);

    res.status(201).json({
      message: "Person and Land created successfully!",
      result,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Update payment data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updatePayment = async (req, res) => {
    try {
        // Extract the payment ID and update data from the request body

        const { payment_id, ...paymentData } = req.body;

        // Call the service to update the payment
        const updatedPayment = await paymentService.updatePayment(
            payment_id,
            paymentData
        );

        // Respond with the updated payment
        res.status(200).json({
            message: "Payment updated successfully.",
            data: updatedPayment,
        });
    } catch (err) {
        // Handle errors and send an appropriate response
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

/**
 * Delete a payment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const deletePayment = async (req, res) => {
    try {
        // Extract the payment ID from the request parameters
        const paymentId = req.body.payment_id;

        // Call the service to delete the payment
        const result = await paymentService.deletePayment(paymentId);

        // If no payment is found to delete, return a 404 error
        if (!result) {
            return res.status(404).json({ message: "Payment not found." });
        }

        // Return a 204 No Content status if deletion is successful
        res.status(204).send();
    } catch (err) {
        // Handle errors and send an appropriate response
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

/**
 * Find a payment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const findById = async (req, res) => {
    try {
        // Extract the payment ID from the request parameters
        const paymentId = req.params.payment_id;

        // Call the service to find the payment by ID
        const payment = await paymentService.getPaymentById(paymentId);

        // If the payment is not found, return a 404 error
        if (!payment) {
            return res.status(404).json({ message: "Payment not found." });
        }

        // Respond with the found payment
        res.status(200).json(payment);
    } catch (err) {
        // Handle errors and send an appropriate response
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

/**
 * Get all payments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const findAllPayment = async (req, res) => {
    try {
        const options = QueryBuilder.buildOptions(req);
        const payments = await paymentService.getAllPayments(options);

        res.status(200).json(payments);
    } catch (err) {
        console.error("Error in findAllPayment controller: ", err.message);
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const findAllProfits = async (req, res) => {
    try {
        const options = QueryBuilder.buildOptions(req);
        const payments = await paymentService.getAllProfits(options);

        res.status(200).json(payments);
    } catch (err) {
        console.error("Error in findAllPayment controller: ", err.message);
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const getDailyRevenue = async (req, res) => {
    try {
        const { start_day, end_day, current_month, current_year } = req.query;
        // // console.log('🚀 ~ StatisticsController ~ getDailyRevenue ~ req.query:', req.query);

        const result = await paymentService.getDailyRevenue(
            start_day,
            end_day,
            current_month,
            current_year
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

//
const getMonthlyRevenue = async (req, res) => {
    try {
        const { start_month, end_month, current_year } = req.query;
        // // console.log('🚀 ~ StatisticsController ~ getMonthlyRevenue ~ req.query:', req.query);

        const result = await paymentService.getMonthlyRevenue(
            start_month,
            end_month,
            current_year
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

//
const getYearlyRevenue = async (req, res) => {
    try {
        const { start_year, end_year } = req.query;

        const result = await paymentService.getYearlyRevenue(
            start_year,
            end_year
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// Export all controller functions
module.exports = {
    createPerson,
    updatePayment,
    deletePayment,
    findById,
    findAllPayment,
    findAllProfits,
    getDailyRevenue,
    getMonthlyRevenue,
    getYearlyRevenue,
};

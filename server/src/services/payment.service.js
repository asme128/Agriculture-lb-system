// Import the Payment model and custom error handler
const Payment = require("../models/payment.model");
const CustomError = require("../utils/CustomError");

class PaymentService {
    /**
     * Create a new payment entry
     * @param {Object} paymentData - Data for the new payment entry
     */
    async createPayment(paymentData) {
        try {
            const payment = await Payment.create(paymentData);
            return payment;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error creating payment"
            );
        }
    }

    async getAllPayments(options) {
        try {
            const payments = await Payment.findAll(options);
            return payments;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving payments"
            );
        }
    }

    async getAllProfits(options) {
        try {
            const payments = await Payment.findAllProfits(options);
            return payments;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving payments"
            );
        }
    }

    /**
     * Get a payment entry by ID
     * @param {string} paymentId - ID of the payment
     */
    async getPaymentById(paymentId) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                throw new CustomError(404, "Payment not found");
            }
            return payment;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving payment"
            );
        }
    }

    /**
     * Update a payment entry
     * @param {string} paymentId - ID of the payment
     * @param {Object} paymentData - Data to update the payment entry
     */
    async updatePayment(paymentId, paymentData) {
        try {
            const payment = await Payment.updatePayment(paymentId, paymentData);
            return payment;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error updating payment"
            );
        }
    }

    async getDailyRevenue(start_day, end_day, current_month, current_year) {
        try {
            const dailyRevenue = await Payment.getDailyRevenue(
                start_day,
                end_day,
                current_month,
                current_year
            );
            return dailyRevenue;
        } catch (err) {
            throw new CustomError(
                500,
                "Error fetching daily revenue: " + err.message
            );
        }
    }

    // Get monthly revenue for a hospital
    async getMonthlyRevenue(start_month, end_month, current_year) {
        try {
            const monthlyRevenue = await Payment.getMonthlyRevenue(
                start_month,
                end_month,
                current_year
            );
            return monthlyRevenue;
        } catch (err) {
            throw new CustomError(
                500,
                "Error fetching monthly revenue: " + err.message
            );
        }
    }

    // Get yearly revenue for a hospital
    async getYearlyRevenue(start_year, end_year) {
        try {
            const yearlyRevenue = await Payment.getYearlyRevenue(
                start_year,
                end_year
            );
            return yearlyRevenue;
        } catch (err) {
            throw new CustomError(
                500,
                "Error fetching yearly revenue: " + err.message
            );
        }
    }

    /**
     * Delete a payment entry
     * @param {string} paymentId - ID of the payment
     */
    async deletePayment(paymentId) {
        try {
            const result = await Payment.deletePayment(paymentId);
            return result;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error deleting payment"
            );
        }
    }

    /**
     * Get all payment entries
     */
}

module.exports = new PaymentService();

const visitService = require("../services/visit.service");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

class VisitController {
    /**
     * Create a new visit
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async createVisit(req, res, next) {
        try {
            const visit = await visitService.createVisit(req.body);

            res.status(201).json({
                success: true,
                message: "Visit created successfully",
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    /**
     * Get all visits with optional filtering
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getAllVisits(req, res, next) {
        try {
            const options = QueryBuilder.buildOptions(req);
            const visits = await visitService.getAllVisits(options);
            res.status(200).json(visits);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    /**
     * Get a visit by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getVisitById(req, res, next) {
        try {
            const visit = await visitService.getVisitById(req.params.visit_id);
            res.status(200).json(visit);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    /**
     * Update a visit
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateVisit(req, res, next) {
        try {
            const { visit_id, ...visitData } = req.body;
            const visit = await visitService.updateVisit(visit_id, visitData);
            res.status(200).json({
                success: true,
                message: "Visit updated successfully",
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    /**
     * Delete a visit
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async deleteVisit(req, res, next) {
        try {
            const result = await visitService.deleteVisit(req.body.visit_id);
            res.status(200).json({
                success: true,
                message: "Visit deleted successfully",
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }
}

module.exports = new VisitController();

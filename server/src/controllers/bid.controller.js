const bidService = require("../services/bid.service");
const CustomError = require("../utils/CustomError");
const QueryBuilder = require("../utils/queryBuilder");

class BidController {
    /**
     * Create a new bid
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async createBid(req, res, next) {
        try {
            const bid = await bidService.createBid(req.body);

            res.status(201).json({
                success: true,
                message: "Bid created successfully",
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    /**
     * Get all bids with optional filtering
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getAllBids(req, res, next) {
        try {
            const options = QueryBuilder.buildOptions(req);
            const bids = await bidService.getAllBids(options);
            res.status(200).json(bids);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    /**
     * Get a bid by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getBidById(req, res, next) {
        try {
            const bid = await bidService.getBidById(req.params.bid_id);
            res.status(200).json(bid);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    /**
     * Update a bid
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateBid(req, res, next) {
        try {
            const { bid_id, ...bidData } = req.body;
            const bid = await bidService.updateBid(bid_id, bidData);
            res.status(200).json({
                success: true,
                message: "Bid updated successfully",
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    /**
     * Delete a bid
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async deleteBid(req, res, next) {
        try {
            const result = await bidService.deleteBid(req.body.bid_id);
            res.status(200).json({
                success: true,
                message: "Bid deleted successfully",
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }
}

module.exports = new BidController();

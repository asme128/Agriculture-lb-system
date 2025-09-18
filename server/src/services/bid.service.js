const Bid = require("../models/bid.model");
const CustomError = require("../utils/CustomError");
const fs = require("fs").promises;
const path = require("path");

class BidService {
    /**
     * Create a new bid entry
     * @param {Object} bidData - Data for the new bid entry
     */
    async createBid(bidData) {
        try {
            const bid = await Bid.create(bidData);
            return bid;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error creating bid"
            );
        }
    }

    /**
     * Get all bids with optional filtering
     * @param {Object} options - Filtering and sorting options
     */
    async getAllBids(options) {
        try {
            const bids = await Bid.findAll(options);
            return bids;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving bids"
            );
        }
    }

    /**
     * Get a bid entry by ID
     * @param {string} bidId - ID of the bid
     */
    async getBidById(bidId) {
        try {
            const bid = await Bid.findById(bidId);
            if (!bid) {
                throw new CustomError(404, "Bid not found");
            }
            return bid;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving bid"
            );
        }
    }

    /**
     * Update a bid entry
     * @param {string} bidId - ID of the bid
     * @param {Object} bidData - Data to update the bid entry
     */
    async updateBid(bidId, bidData) {
        try {
            const existingBid = await Bid.findById(bidId);
            if (!existingBid) {
                throw new CustomError(404, "Bid not found");
            }

            if (bidData.bid_data) {
                let bidData;
                try {
                    bidData =
                        typeof existingBid.bid_data === "string"
                            ? JSON.parse(existingBid.bid_data || "[]")
                            : existingBid.bid_data || [];
                } catch (err) {
                    console.error("Error parsing bid_data:", err);
                    bidData = [];
                }
                // Get new bid data
                let newOperationData;
                try {
                    newOperationData =
                        typeof bidData.bid_data === "string"
                            ? JSON.parse(bidData.bid_data || "[]")
                            : bidData.bid_data || [];
                } catch (err) {
                    console.error("Error parsing new bid_data:", err);
                    newOperationData = [];
                }

                // Create a set of filenames from the new bid data for quick lookup
                const newFileNames = new Set(
                    newOperationData
                        .filter(
                            (item) =>
                                item.type === "voice" || item.type === "image"
                        )
                        .map((item) => path.basename(item?.value || ""))
                );

                // Delete associated files that are not in the new bid data
                for (const item of bidData) {
                    if (item.type === "voice" || item.type === "image") {
                        const filename = path.basename(item?.value || "");

                        // Only delete if the file is not present in the new bid data
                        if (!newFileNames.has(filename)) {
                            const filePath = path.join(
                                __dirname,
                                "..",
                                item.type === "voice"
                                    ? "uploads/voice"
                                    : "uploads/images",
                                filename
                            );

                            try {
                                await fs.unlink(filePath);
                            } catch (err) {
                                console.error(
                                    `Error deleting ${item.type} file ${filename}:`,
                                    err
                                );
                            }
                        }
                    }
                }
            }
            const bid = await Bid.updateBid(bidId, bidData);

            return bid;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error updating bid"
            );
        }
    }

    /**
     * Delete a bid entry
     * @param {string} bidId - ID of the bid
     */
    async deleteBid(bidId) {
        try {
            // Check if bid exists
            const existingBid = await Bid.findById(bidId);
            if (!existingBid) {
                throw new CustomError(404, "Bid not found");
            }

            // Handle bid_data (could be string or already parsed object)
            let bidData;
            try {
                bidData =
                    typeof existingBid.bid_data === "string"
                        ? JSON.parse(existingBid.bid_data || "[]")
                        : existingBid.bid_data || [];
            } catch (err) {
                console.error("Error parsing bid_data:", err);
                bidData = [];
            }

            // Delete associated files
            for (const item of bidData) {
                if (item.type === "voice" || item.type === "image") {
                    // Extract filename from the path
                    const filename = path.basename(item?.value || "");
                    const filePath = path.join(
                        __dirname,
                        "..",
                        item.type === "voice"
                            ? "uploads/voice"
                            : "uploads/images",
                        filename
                    );

                    try {
                        await fs.unlink(filePath);
                    } catch (err) {
                        console.error(
                            `Error deleting ${item.type} file ${filename}:`,
                            err
                        );
                    }
                }
            }
            const result = await Bid.deleteBid(bidId);
            return result;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error deleting bid"
            );
        }
    }
}

module.exports = new BidService();

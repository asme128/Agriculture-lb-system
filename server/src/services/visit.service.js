const Visit = require("../models/visit.model");
const CustomError = require("../utils/CustomError");
const fs = require("fs").promises;
const path = require("path");

class VisitService {
    /**
     * Create a new visit entry
     * @param {Object} visitData - Data for the new visit entry
     */
    async createVisit(visitData) {
        try {
            const visit = await Visit.create(visitData);
            return visit;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error creating visit"
            );
        }
    }

    /**
     * Get all visits with optional filtering
     * @param {Object} options - Filtering and sorting options
     */
    async getAllVisits(options) {
        try {
            const visits = await Visit.findAll(options);
            return visits;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving visits"
            );
        }
    }

    /**
     * Get a visit entry by ID
     * @param {string} visitId - ID of the visit
     */
    async getVisitById(visitId) {
        try {
            const visit = await Visit.findById(visitId);
            if (!visit) {
                throw new CustomError(404, "Visit not found");
            }
            return visit;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving visit"
            );
        }
    }

    /**
     * Update a visit entry
     * @param {string} visitId - ID of the visit
     * @param {Object} visitData - Data to update the visit entry
     */
    async updateVisit(visitId, visitData) {
        try {
            const existingVisit = await Visit.findById(visitId);
            if (!existingVisit) {
                throw new CustomError(404, "Visit not found");
            }

            if (visitData.visit_data) {
                let visitData;
                try {
                    visitData =
                        typeof existingVisit.visit_data === "string"
                            ? JSON.parse(existingVisit.visit_data || "[]")
                            : existingVisit.visit_data || [];
                } catch (err) {
                    console.error("Error parsing visit_data:", err);
                    visitData = [];
                }
                // Get new visit data
                let newOperationData;
                try {
                    newOperationData =
                        typeof visitData.visit_data === "string"
                            ? JSON.parse(visitData.visit_data || "[]")
                            : visitData.visit_data || [];
                } catch (err) {
                    console.error("Error parsing new visit_data:", err);
                    newOperationData = [];
                }

                // Create a set of filenames from the new visit data for quick lookup
                const newFileNames = new Set(
                    newOperationData
                        .filter(
                            (item) =>
                                item.type === "voice" || item.type === "image"
                        )
                        .map((item) => path.basename(item?.value || ""))
                );

                // Delete associated files that are not in the new visit data
                for (const item of visitData) {
                    if (item.type === "voice" || item.type === "image") {
                        const filename = path.basename(item?.value || "");

                        // Only delete if the file is not present in the new visit data
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
            const visit = await Visit.updateVisit(visitId, visitData);

            return visit;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error updating visit"
            );
        }
    }

    /**
     * Delete a visit entry
     * @param {string} visitId - ID of the visit
     */
    async deleteVisit(visitId) {
        try {
            // Check if visit exists
            const existingVisit = await Visit.findById(visitId);
            if (!existingVisit) {
                throw new CustomError(404, "Visit not found");
            }

            // Handle visit_data (could be string or already parsed object)
            let visitData;
            try {
                visitData =
                    typeof existingVisit.visit_data === "string"
                        ? JSON.parse(existingVisit.visit_data || "[]")
                        : existingVisit.visit_data || [];
            } catch (err) {
                console.error("Error parsing visit_data:", err);
                visitData = [];
            }

            // Delete associated files
            for (const item of visitData) {
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
            const result = await Visit.deleteVisit(visitId);
            return result;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error deleting visit"
            );
        }
    }
}

module.exports = new VisitService();

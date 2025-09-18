const Operation = require("../models/operations.model");
const CustomError = require("../utils/CustomError");
const fs = require("fs").promises;
const path = require("path");

class OperationService {
    async getAllOperations(options = {}) {
        try {
            const operations = await Operation.findAllOperation(options);
            return operations;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async updateOperation(operation_id, operationData) {
        try {
            const { type, ...updateData } = operationData;
            // Check if operation exists
            const existingOperation = await Operation.findById(
                operation_id,
                type
            );

            if (!existingOperation) {
                throw new CustomError(404, "Operation not found");
            }

            // Only proceed with file deletion if operationData.operation_data exists
            if (operationData.operation_data) {
                let operationData;
                try {
                    operationData =
                        typeof existingOperation.operation_data === "string"
                            ? JSON.parse(
                                  existingOperation.operation_data || "[]"
                              )
                            : existingOperation.operation_data || [];
                } catch (err) {
                    console.error("Error parsing operation_data:", err);
                    operationData = [];
                }
                // Get new operation data
                let newOperationData;
                try {
                    newOperationData =
                        typeof operationData.operation_data === "string"
                            ? JSON.parse(operationData.operation_data || "[]")
                            : operationData.operation_data || [];
                } catch (err) {
                    console.error("Error parsing new operation_data:", err);
                    newOperationData = [];
                }

                // Create a set of filenames from the new operation data for quick lookup
                const newFileNames = new Set(
                    newOperationData
                        .filter(
                            (item) =>
                                item.type === "voice" || item.type === "image"
                        )
                        .map((item) => path.basename(item?.value || ""))
                );

                // Delete associated files that are not in the new operation data
                for (const item of operationData) {
                    if (item.type === "voice" || item.type === "image") {
                        const filename = path.basename(item?.value || "");

                        // Only delete if the file is not present in the new operation data
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
                                // console.log(
                                // "🚀 ~ OperationService ~ updateOperation ~ filePath:",
                                // filePath
                                // );

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

            // Update operation
            await Operation.update(operation_id, updateData, type);
            return operation_id;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }
}

module.exports = new OperationService();

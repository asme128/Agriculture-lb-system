const Operation = require("../models/operations.model");
const OperationInventory = require("../models/operations.inventory.model");
const CustomError = require("../utils/CustomError");
const fs = require("fs").promises;
const path = require("path");

class ProjectService {
    async createProject(projectData) {
        try {
            // Validate project data
            if (!projectData.operation_name || !projectData.customer_id) {
                throw new CustomError(
                    400,
                    "Project name and customer ID are required"
                );
            }

            // Set default values if not provided
            projectData.operation_status =
                projectData.operation_status || "pending";
            projectData.payment_status =
                projectData.payment_status || "not paid";
            projectData.proforma_created = projectData.proforma_created || "0";

            // Create project
            const projectId = await Operation.create({
                ...projectData,
                type: "project",
            });
            return projectId;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async addInventory(inventoryData) {
        try {
            // Validate project data
            if (!inventoryData.operation_id) {
                throw new CustomError(400, "Project ID is required");
            }

            // Create project inv
            const operationId = await OperationInventory.create({
                ...inventoryData,
                type: "project",
                added_date: new Date(),
            });

            return operationId;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getAllProjects(options = {}) {
        try {
            const projects = await Operation.findAll("project", options);
            return projects;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getAllOperations(options = {}) {
        try {
            const projects = await Operation.findAllOperation(options);
            return projects;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getProjectById(operation_id) {
        try {
            const project = await Operation.findById(operation_id, "project");
            if (!project) {
                throw new CustomError(404, "Project not found");
            }
            return project;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async updateProject(operation_id, projectData) {
        try {
            // Check if project exists
            const existingProject = await Operation.findById(
                operation_id,
                "project"
            );
            if (!existingProject) {
                throw new CustomError(404, "Project not found");
            }

            // Proceed only if operation_data is present update file data accordingly
            if (projectData.operation_data) {
                let oldData = [];
                try {
                    oldData = Array.isArray(existingProject.operation_data)
                        ? existingProject.operation_data
                        : JSON.parse(existingProject.operation_data || "[]");
                } catch (err) {
                    console.error(
                        "Error parsing existing operation_data:",
                        err
                    );
                }

                let newData = [];
                try {
                    newData = Array.isArray(projectData.operation_data)
                        ? projectData.operation_data
                        : JSON.parse(projectData.operation_data || "[]");
                } catch (err) {
                    console.error("Error parsing new operation_data:", err);
                }

                // Create maps for quick lookup
                const oldDataMap = new Map(
                    oldData.map((item) => [item.name, item])
                );

                // Merge newData with oldData
                const mergedData = newData.map((newItem) => {
                    const oldItem = oldDataMap.get(newItem.name);
                    if (
                        (newItem.type === "voice" ||
                            newItem.type === "image") &&
                        !newItem.value &&
                        oldItem?.value
                    ) {
                        return { ...newItem, value: oldItem.value };
                    }
                    return newItem;
                });

                // Files to delete: old items not present in merged data

                for (const oldItem of oldData) {
                    if (
                        (oldItem.type === "voice" ||
                            oldItem.type === "image") &&
                        oldItem.value
                    ) {
                        const newItem = mergedData.find(
                            (item) => item.name === oldItem.name
                        );

                        const fileWasRemoved =
                            !newItem || // item no longer exists
                            !newItem.value || // item exists but has no file now
                            newItem.value !== oldItem.value; // file was replaced

                        if (fileWasRemoved) {
                            const filename = path.basename(oldItem.value);
                            const folder =
                                oldItem.type === "voice"
                                    ? "uploads/voice"
                                    : "uploads/images";
                            const filePath = path.join(
                                __dirname,
                                "..",
                                folder,
                                filename
                            );

                            try {
                                await fs.unlink(filePath);
                                console.log(
                                    `✅ Deleted unused ${oldItem.type} file: ${filename}`
                                );
                            } catch (err) {
                                console.error(
                                    `❌ Error deleting ${oldItem.type} file ${filename}:`,
                                    err
                                );
                            }
                        }
                    }
                }

                // Save merged data back to projectData
                projectData.operation_data = mergedData;
            }

            // Update the project with final merged data
            await Operation.update(operation_id, projectData, "project");
            return operation_id;
        } catch (err) {
            console.error("🚀 ~ ProjectService ~ updateProject ~ err:", err);
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async deleteProject(operation_id) {
        try {
            // Check if project exists
            const existingProject = await Operation.findById(
                operation_id,
                "project"
            );
            if (!existingProject) {
                throw new CustomError(404, "Project not found");
            }

            // Handle operation_data (could be string or already parsed object)
            let operationData;
            try {
                operationData =
                    typeof existingProject.operation_data === "string"
                        ? JSON.parse(existingProject.operation_data || "[]")
                        : existingProject.operation_data || [];
            } catch (err) {
                console.error("Error parsing operation_data:", err);
                operationData = [];
            }

            // Delete associated files
            for (const item of operationData) {
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

            // Delete project
            await Operation.delete(operation_id, "project");
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async deleteProjectInventory(operation_id) {
        try {
            // Check if project exists

            const existingProject = await Operation.findById(
                operation_id,
                "project"
            );
            if (!existingProject) {
                throw new CustomError(404, "Project not found");
            }
            // Delete project
            await OperationInventory.delete(operation_id, "project");
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }
}

module.exports = new ProjectService();

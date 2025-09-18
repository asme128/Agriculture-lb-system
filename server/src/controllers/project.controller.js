const ProjectService = require("../services/project.service");
const InventoryService = require("../services/inventory.service");
const OperationInventoryService = require("../services/operation.inventory.service");
const QueryBuilder = require("../utils/queryBuilder");
const remainderService = require("../services/remainder.service");

const createProject = async (req, res) => {
    try {
        const projectData = req.body;
        const projectId = await ProjectService.createProject(projectData);
        const inventory_data = projectData.inventory_data;

        try {
            if (
                projectData.stock_status === "in stock" &&
                inventory_data?.length
            ) {
                // Validate inventory items
                for (const inv of inventory_data) {
                    if (inv.quantity_required === 0 || inv.price === 0) {
                        await ProjectService.deleteProject(projectId);
                        return res.status(400).json({
                            message: `Price or quantity required cannot be zero for ${inv.inventory_name}!`,
                        });
                    }
                    const { isAvailabe, previousInventory } =
                        await InventoryService.quantityAvailable(inv);

                    if (!isAvailabe) {
                        await ProjectService.deleteProject(projectId);
                        return res.status(400).json({
                            message: `Insufficient Inventory Item! Not enough quantity is in stock for ${inv.inventory_name}. Required: ${inv.quantity_required}, Available: ${previousInventory.quantity}`,
                            insufficientItem: {
                                name: inv.inventory_name,
                                required: inv.quantity_required,
                                available: previousInventory.quantity,
                            },
                        });
                    }

                    await ProjectService.addInventory({
                        operation_id: projectId,
                        ...inv,
                    });
                }
            }

            res.status(201).json({
                message: "Project created successfully!",
                operation_id: projectId,
            });
        } catch (err) {
            // If any error occurs during inventory operations, delete the created project
            await ProjectService.deleteProject(projectId);
            throw err;
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const createProjectInventory = async (req, res) => {
    try {
        const { operation_id, type, inventory_data } = req.body;

        // First, validate all inventory quantities
        for (const inv of inventory_data) {
            const isAvailabe = InventoryService.quantityAvailable(inv);

            if (!isAvailabe) {
                ProjectService.deleteProject(operation_id);

                return res.status(400).json({
                    message: `Insufficient Inventory Item! Not enough quantity is in stock for ${inv.inventory_name}. Required: ${inv.quantity_required}, Available: ${previousInventory.quantity}`,
                    insufficientItem: {
                        name: inv.inventory_name,
                        required: inv.quantity_required,
                        available: previousInventory.quantity,
                    },
                });
            }
        }

        // If all quantities are sufficient, proceed with the updates
        for (const inv of inventory_data) {
            const previousInventory = await InventoryService.getById(
                inv.inventory_id
            );
            const newQuantity =
                parseInt(previousInventory.quantity) -
                parseInt(inv.quantity_required);

            await ProjectService.addInventory({
                operation_id,
                type,
                ...inv,
            });

            await InventoryService.updateInventoryQuantity({
                inventory_id: previousInventory.inventory_id,
                quantity: newQuantity,
            });
        }

        res.status(201).json({
            message: "Requred inventory assigned successfully!",
            project_id: operation_id,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const options = QueryBuilder.buildOptions(req);

        const projects = await ProjectService.getAllProjects(options);
        res.status(200).json(projects);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const getAllOperations = async (req, res) => {
    try {
        const options = QueryBuilder.buildOptions(req);

        const projects = await ProjectService.getAllOperations(options);
        res.status(200).json(projects);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project_id = req.params.operation_id;
        // console.log("🚀 ~ getProjectById ~ project_id:", project_id);
        const project = await ProjectService.getProjectById(project_id);
        // console.log("🚀 ~ getProjectById ~ project:", project);

        let projectInventory;
        if (project.stock_status === "in stock") {
            projectInventory =
                await OperationInventoryService.getOperationInventoryById(
                    project_id,
                    "project"
                );
        }

        res.status(200).json({
            ...project,
            ...(project.stock_status === "in stock" &&
                projectInventory?.length && {
                    operation_inventory: projectInventory,
                }),
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { operation_id, inventory_data, ...projectData } = req.body;
        const projectId = operation_id;

        if (projectData.stock_status === "in stock" && inventory_data?.length) {
            for (const inv of inventory_data) {
                if (inv.quantity_required === 0 || inv.price === 0) {
                    return res.status(400).json({
                        message: `Price or quantity required cannot be zero for ${inv.inventory_name}!`,
                    });
                }
                const { isAvailabe, actualInventory } =
                    await InventoryService.quantityAvailable(inv);

                if (!isAvailabe) {
                    return res.status(400).json({
                        message: `Insufficient Inventory Item! Not enough quantity is in stock for ${inv.inventory_name}. Required: ${inv.quantity_required}, Available: ${actualInventory.quantity}`,
                        insufficientItem: {
                            name: inv.inventory_name,
                            required: inv.quantity_required,
                            available: actualInventory.quantity,
                        },
                    });
                }
            }

            await ProjectService.deleteProjectInventory(operation_id);

            for (const inv of inventory_data) {
                await ProjectService.addInventory({
                    operation_id: projectId,
                    ...inv,
                });
            }
        }

        //update inventory quantity when project is approved
        if (
            projectData.operation_status === "approved" &&
            projectData.approved_at !== null
        ) {
            const previousOpInv =
                await OperationInventoryService.getOperationInventoryById(
                    projectId,
                    "project"
                );

            const projectInfo = await ProjectService.getProjectById(projectId);

            // Process inventory items
            for (const inv of previousOpInv) {
                const previousInventory = await InventoryService.getById(
                    inv.inventory_id
                );

                const { isAvailabe, actualInventory } =
                    await InventoryService.quantityAvailable(inv);

                if (!isAvailabe) {
                    return res.status(400).json({
                        message: `Insufficient Inventory Item! Not enough quantity is in stock for ${inv.inventory_name}. Required: ${inv.quantity_required}, Available: ${actualInventory.quantity}`,
                        insufficientItem: {
                            name: inv.inventory_name,
                            required: inv.quantity_required,
                            available: actualInventory.quantity,
                        },
                    });
                }

                if (previousInventory.inventory_id !== "installation") {
                    const newQuantity =
                        parseInt(previousInventory.quantity) -
                        parseInt(inv.quantity_required);

                    await InventoryService.updateInventoryQuantity({
                        inventory_id: previousInventory.inventory_id,
                        quantity: newQuantity,
                    });
                }
            }

            // Calculate total amount from inventory data

            const totalAmount = previousOpInv.reduce((sum, item) => {
                const total = item.quantity_required * item.price;
                const VAT = total * 0.15;

                return sum + total + VAT;
            }, 0);

            // Create remainder for the project
            await remainderService.createRemainder({
                remainder_for: projectId,
                remainder_reason: `Project Invoice - ${projectInfo.operation_name}`,
                user_id: projectInfo.created_by,
                amount: totalAmount,
                type: "project",
                remainder_date: new Date(),
            });
        }
        await ProjectService.updateProject(projectId, projectData);

        res.status(200).json({
            message: "Project updated successfully",
            project_id: projectId,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        await ProjectService.deleteProject(req.body.operation_id);
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

module.exports = {
    createProject,
    createProjectInventory,
    getAllProjects,
    getAllOperations,
    getProjectById,
    updateProject,
    deleteProject,
};

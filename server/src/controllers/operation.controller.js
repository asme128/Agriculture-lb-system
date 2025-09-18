const operationService = require("../services/operation.service");
const QueryBuilder = require("../utils/queryBuilder");

const getAllOperations = async (req, res) => {
    try {
        const options = QueryBuilder.buildOptions(req);

        const operations = await operationService.getAllOperations(options);

        res.status(200).json(operations);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const updateOperation = async (req, res) => {
    try {
        const { operation_id, ...operationData } = req.body;
        const updatedOperation = await operationService.updateOperation(
            operation_id,
            operationData
        );
        res.status(200).json(updatedOperation);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

module.exports = {
    getAllOperations,
    updateOperation,
};

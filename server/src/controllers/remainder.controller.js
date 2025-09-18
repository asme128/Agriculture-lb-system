const remainderService = require("../services/remainder.service");
const QueryBuilder = require("../utils/queryBuilder");

class RemainderController {
    async createRemainder(req, res, next) {
        try {
            const remainder = await remainderService.createRemainder(req.body);
            res.status(201).json({
                success: true,
                message: "Remainder created successfully",
                data: remainder,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllRemainders(req, res, next) {
        try {
            const options = QueryBuilder.buildOptions(req);
            const remainders = await remainderService.getAllRemainders(options);
            res.status(200).json(remainders);
        } catch (error) {
            next(error);
        }
    }

    async getRemainderById(req, res, next) {
        try {
            const remainder = await remainderService.getRemainderById(
                req.params.remainder_id
            );
            res.status(200).json(remainder);
        } catch (error) {
            next(error);
        }
    }

    async updateRemainder(req, res, next) {
        try {
            const { remainder_id, ...remainderData } = req.body;
            const remainder = await remainderService.updateRemainder(
                remainder_id,
                remainderData
            );
            res.status(200).json({
                success: true,
                message: "Remainder updated successfully",
                data: remainder,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteRemainder(req, res, next) {
        try {
            await remainderService.deleteRemainder(req.body.remainder_id);
            res.status(200).json({
                success: true,
                message: "Remainder deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RemainderController();

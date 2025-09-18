const Remainder = require("../models/remainder.model");
const CustomError = require("../utils/CustomError");

class RemainderService {
    async createRemainder(remainderData) {
        try {
            return await Remainder.create(remainderData);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getAllRemainders(options = {}) {
        try {
            return await Remainder.findAll(options);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getRemainderById(remainder_id) {
        try {
            return await Remainder.findById(remainder_id);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async updateRemainder(remainder_id, remainderData) {
        try {
            return await Remainder.update(remainder_id, remainderData);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async deleteRemainder(remainder_id) {
        try {
            await Remainder.delete(remainder_id);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }
}

module.exports = new RemainderService();

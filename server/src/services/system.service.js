const System = require("../models/system.model");
const CustomError = require("../utils/CustomError");

class SystemService {
    async updateForms(formData) {
        try {
            return await System.updateForms(formData);
        } catch (error) {
            throw error;
        }
    }

    async getForms() {
        try {
            return await System.getForms();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SystemService();

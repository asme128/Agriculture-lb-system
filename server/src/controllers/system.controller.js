const systemService = require("../services/system.service");
const transformNameToString = require("../utils/transformNameToString");

class SystemController {
    async updateForms(req, res, next) {
        try {
            await systemService.updateForms(req.body);

            const formName = Object?.keys(req.body) || ["Form Data"];
            const nameData = transformNameToString(formName[0]);
            res.status(200).json({
                success: true,
                message: `${nameData} updated successfully`,
            });
        } catch (error) {
            next(error);
        }
    }

    async getForms(req, res, next) {
        try {
            const forms = await systemService.getForms();
            res.status(200).json({
                success: true,
                data: forms,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SystemController();

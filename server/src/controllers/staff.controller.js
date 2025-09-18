const StaffService = require("../services/staff.service");
const CustomError = require("../utils/CustomError");
const Staff = require("../models/staff.model");
const { validate } = require("../validations/staff.validation");

class StaffController {
    static async createStaff(req, res, next) {
        try {
            await StaffService.createStaff(req.body);
            res.status(201).json({
                message: "Staff added successfully!",
                // data: newStaff,
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    static async getAllStaff(req, res, next) {
        try {
            const staff = await StaffService.getAllStaff();
            res.status(200).json(staff);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }
    static async getStaffStatistics(req, res, next) {
        try {
            const stats = await StaffService.getStaffStatistics();
            res.status(200).json(stats);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    static async getStaffById(req, res, next) {
        try {
            const { staff_id } = req.params;
            const staff = await StaffService.getStaffById(staff_id);
            res.status(200).json({
                message: "",
                data: staff,
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    static async getStaffByUserId(req, res, next) {
        try {
            const { user_id } = req.params;
            const staff = await StaffService.getStaffByUserId(user_id);
            res.status(200).json(staff);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    static async updateStaff(req, res) {
        try {
            const { user_id, ...staffData } = req.body;

            const staff = await StaffService.getStaffByUserId(user_id);
            if (!staff) {
                return res.status(404).json({ message: "Staff not found" });
            }

            await StaffService.updateStaff(user_id, staffData);
            res.json({
                message: "Staff updated successfully",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updatePassword(req, res) {
        try {
            const { user_id, current_password, new_password } = req.body;

            const staff = await StaffService.getStaffByUserId(user_id);
            if (!staff) {
                return res.status(404).json({ message: "Staff not found" });
            }

            await StaffService.updatePassword(
                user_id,
                current_password,
                new_password
            );

            res.json({
                message: "Password updated successfully",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteStaff(req, res, next) {
        try {
            const { user_id } = req.body;

            const staff = await StaffService.getStaffByUserId(user_id);
            if (!staff) {
                return res.status(404).json({ message: "Staff not found" });
            }

            await StaffService.deleteStaff(user_id);
            res.status(200).json({
                message: "Staff deleted successfully",
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    static async verifyPassword(req, res, next) {
        try {
            const { user_id } = req.params;
            const { password } = req.body;
            const isMatch = await StaffService.verifyStaffPassword(
                user_id,
                password
            );
            res.status(200).json({
                data: { isMatch },
            });
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message });
        }
    }
}

module.exports = StaffController;

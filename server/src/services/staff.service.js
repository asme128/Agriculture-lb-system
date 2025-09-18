const Staff = require("../models/staff.model");
const CustomError = require("../utils/CustomError");

class StaffService {
    static async createStaff(staffData) {
        try {
            const newStaff = await Staff.create(staffData);
            return newStaff;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error creating staff"
            );
        }
    }

    static async getAllStaff() {
        try {
            const staff = await Staff.findAll();
            return staff;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving staff"
            );
        }
    }

    static async getStaffStatistics() {
        try {
            const staffs = await Staff.findAll();

            // Use Promise.all to await all async operations in the map
            const staffStatistics = await Promise.all(
                staffs.map(async (staff) => {
                    const [
                        countToday,
                        countThisWeek,
                        countThisMonth,
                        countThisYear,
                        countTotal,
                    ] = await Promise.all([
                        Staff.countCustomersToday(staff.user_id),
                        Staff.countCustomersThisWeek(staff.user_id),
                        Staff.countCustomersThisMonth(staff.user_id),
                        Staff.countCustomersThisYear(staff.user_id),
                        Staff.countCustomersTotal(staff.user_id),
                    ]);

                    return {
                        user_id: staff.user_id,
                        staff_id: staff.staff_id,
                        role_id: staff.role_id,
                        user_name: staff.user_name,
                        gender: staff.gender,
                        phone: staff.phone,
                        count_customers_today: countToday,
                        count_customers_this_week: countThisWeek,
                        count_customers_this_month: countThisMonth,
                        count_customers_this_year: countThisYear,
                        count_customers_total: countTotal,
                    };
                })
            );

            return staffStatistics;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving staff statistics"
            );
        }
    }

    static async getStaffById(staff_id) {
        try {
            const staff = await Staff.findById(staff_id);
            return staff;
        } catch (err) {
            throw err;
        }
    }

    static async getStaffByUserId(user_id) {
        try {
            const staff = await Staff.findByUserId(user_id);
            return staff;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error retrieving staff"
            );
        }
    }

    static async updateStaff(user_id, staffData) {
        try {
            const updatedStaff = await Staff.update(user_id, staffData);
            return updatedStaff;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error updating staff"
            );
        }
    }
    static async updatePassword(user_id, currentPassword, newPassword) {
        try {
            const updatedStaff = await Staff.updatePassword(
                user_id,
                currentPassword,
                newPassword
            );
            return updatedStaff;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error updating staff"
            );
        }
    }

    static async deleteStaff(user_id) {
        try {
            await Staff.delete(user_id);
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error deleting staff"
            );
        }
    }

    static async verifyStaffPassword(user_id, password) {
        try {
            const isMatch = await Staff.verifyPassword(user_id, password);
            return isMatch;
        } catch (err) {
            throw new CustomError(
                err.statusCode || 500,
                err.message || "Error verifying password"
            );
        }
    }
}

module.exports = StaffService;

const CustomError = require("../utils/CustomError");
const StaffService = require("./staff.service");

class AuthService {
    async loginService(staff_id, user_password) {
        try {
            const staff = await StaffService.getStaffById(staff_id);
            if (!staff) {
                throw new CustomError(401, "Incorrect staff ID or password");
            }

            const isMatch = await StaffService.verifyStaffPassword(
                staff.user_id,
                user_password
            );

            if (!isMatch) {
                throw new CustomError(401, "Incorrect staff ID or password");
            }

            // console.log('🚀 ~ AuthService ~ loginService ~ hospitalPackage:', hospitalPackage);

            return staff;
        } catch (err) {
            throw new CustomError(401, "Incorrect staff ID or password");
        }
    }
}

module.exports = new AuthService();

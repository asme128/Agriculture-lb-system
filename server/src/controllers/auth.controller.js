const config = require("../config/config");
const Token = require("../models/token.model");
const authService = require("../services/auth.service");
const StaffService = require("../services/staff.service");
const systemService = require("../services/system.service");

const login = async (req, res) => {
    try {
        const { staff_id, user_password } = req.body;
        const staffData = await authService.loginService(
            staff_id,
            user_password
        );
        console.log("🚀 ~ login ~ staffData:", staffData);

        const systemData = await systemService.getForms();

        const tokens = await Token.createTokenPair(staffData, req.ip);
        // Send access token to client

        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: config.env === "production" ? true : false, // Ensure this is true in production
            sameSite: config.env === "production" ? "None" : "Lax", // Consider using 'Lax' or 'None' for cross-origin requests
            maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000, // 1 day
            path: "/", // Ensure cookie is available site-wide
        });

        res.json({
            accessToken: tokens.accessToken,
            user: staffData,
            system: systemData,
        });
    } catch (error) {
        console.log("🚀 ~ login ~ error:", error.message);
        res.status(error.statusCode || 500).json({
            message: error.message,
            ...(!!error.data && error.data),
        });
    }
};

const logout = async (req, res) => {
    //service connection required in the future
    // const refreshToken = req.cookies.refreshToken;
    // // console.log('🚀 ~ logout ~ refreshToken:', refreshToken);
    const userId = req.body.user_id; // Get refresh token from cookie

    try {
        await Token.revokeRefreshTokenByUser(userId);

        res.clearCookie("refreshToken"); // Clear the cookie
        res.status(200).json({ message: "Logged out successfully!!" });
    } catch (error) {
        console.log("🚀 ~ logout ~ error:", error);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const activeRefreshTokens = new Set();

//need to implement black list for refresh token
const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    // console.log("🚀 ~ refreshAccessToken ~ refreshToken:", req.cookies);

    try {
        if (!refreshToken) {
            return res.status(419).json({
                message: "RA419: Your session has expired. Please login!",
            });
        }

        // Check if the refresh token is currently being processed
        // if (activeRefreshTokens.has(refreshToken)) {
        //     return res.status(429).json({ message: "Too many requests." });
        // } // Validate the refresh token and get user data
        const { userId, tokenId } = await Token.validateRefreshToken(
            refreshToken
        );

        if (!userId || !tokenId) {
            return res
                .status(401)
                .json({ message: "Invalid session. Please log in again." });
        }

        const userData = await StaffService.getStaffByUserId(userId);

        const newToken = await Token.generateAccessToken(userData);

        res.json({
            accessToken: newToken,
            user: userData,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

module.exports = {
    login,
    logout,
    refreshAccessToken,
};

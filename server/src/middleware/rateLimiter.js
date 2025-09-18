const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
    handler: (req, res, next, options) => {
        return res.status(429).json({
            message: "Too many login attempts. Please try again later.",
        });
    },
});

module.exports = {
    authLimiter,
};

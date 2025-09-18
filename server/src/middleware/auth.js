const passport = require("passport");
const CustomError = require("../utils/CustomError");

const verifyCallback =
    (req, resolve, reject, requiredRoles) => async (err, user, info) => {
        if (!user || err) {
            console.log("🚀 ~ err:", err);
            console.log("🚀 ~ info:", info);

            return reject(
                new CustomError(401, "Authentication failed. Retrying...")
            );
        }
        
        req.user = user;

        if (requiredRoles.length) {
            const userRole = user.auth_id;
            // console.log('🚀 ~ userRole:', userRole);
            const hasRequiredRoles = requiredRoles.some(
                (requiredRole) => userRole === requiredRole
            );
            // console.log('🚀 ~ requiredRoles:', requiredRoles);
            // if (!hasRequiredRoles && req.params.userId !== user.id) {
            if (!hasRequiredRoles) {
                return reject(
                    new CustomError(
                        403,
                        "Access denied. You do not have permission to perform this action."
                    )
                );
            }
        }

        resolve();
    };

const auth =
    (...requiredRoles) =>
    async (req, res, next) => {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                "jwt",
                { session: false },
                verifyCallback(req, resolve, reject, requiredRoles)
            )(req, res, next);
        })
            .then(() => next())
            .catch((err) => {
                // Only send the custom error message without the stack trace
                if (err instanceof CustomError) {
                    console.error(err.message);
                    return res
                        .status(err.statusCode)
                        .json({ message: err.message });
                }
                // Log the error for debugging (optional)
                console.log("🚀 ~ AUTH middleware err:", err); // This will log the full error including stack trace to the server console
                return res
                    .status(500)
                    .json({ error: "An unexpected error occurred." });
            });
    };

module.exports = auth;

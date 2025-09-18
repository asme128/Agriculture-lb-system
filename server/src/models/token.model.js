const config = require("../config/config");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const CustomError = require("../utils/CustomError");

class Token {
    // constructor(user_id, refresh_token, valid_until) {
    //     this.user_id = user_id;
    //     this.refresh_token = refresh_token;
    //     this.valid_until = valid_until;
    // }

    static generateAccessToken(staffData) {
        // Generate an access token with a validity of 15 minutes
        const accessToken = jwt.sign(
            {
                ...staffData,
                createdAt: new Date(),
                type: "access",
            },
            config.jwt.accessSecret,
            {
                expiresIn: `${config.jwt.accessExpirationMinutes}m`,
            }
        );
        return accessToken;
    }

    static generateRefreshToken(staffData) {
        // Generate a refresh token with a longer validity period
        const rawToken = jwt.sign(
            {
                ...staffData,
                createdAt: new Date(),
                type: "refresh",
            },
            config.jwt.refreshSecret,
            {
                expiresIn: `${config.jwt.refreshExpirationDays}d`,
            }
        );

        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");
        return { rawToken, hashedToken };
    }

    static async createToken(
        token_id,
        user_id,
        refresh_token,
        expires_at,
        created_at,
        ip_address
    ) {
        await pool.query(
            "INSERT INTO tokens (token_id, user_id, refresh_token, expires_at, created_at, ip_address) VALUES (?, ?, ?, ?, ?, ?)",
            [
                token_id,
                user_id,
                refresh_token,
                expires_at,
                created_at,
                ip_address,
            ]
        );
    }

    static async createTokenPair(staffData, ip_address) {
        try {
            const token_id = uuidv4();

            const accessToken = this.generateAccessToken(staffData);
            const { rawToken, hashedToken } =
                this.generateRefreshToken(staffData);
            // Calculate the expiration date for the refresh token
            const validUntil = new Date();
            validUntil.setDate(
                validUntil.getDate() + config.jwt.refreshExpirationDays
            ); // Set valid until 7 days from now

            // Save refresh token in the database
            await this.createToken(
                token_id,
                staffData.user_id,
                hashedToken,
                validUntil,
                new Date(),
                ip_address
            );

            // Respond with the access token and refresh token
            return {
                accessToken,
                refreshToken: rawToken,
                refreshExpiration: validUntil,
            };
        } catch (err) {
            throw new Error("Error creating token pair: " + err.message);
        }
    }

    // Method to validate the refresh token
    static async validateRefreshToken(token) {
        let decoded;

        // Verify the JWT token
        try {
            decoded = jwt.verify(token, config.jwt.refreshSecret);

            if (decoded.type !== "refresh") {
                throw new CustomError(401, "Invalid token type");
            }
        } catch (err) {
            throw new CustomError(401, "Invalid refresh token");
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Query to check if the token is valid and not expired
        const query = `
            SELECT * FROM tokens 
            WHERE user_id = ? AND refresh_token = ? AND expires_at > NOW() AND is_revoked = FALSE
        `;

        try {
            const [result] = await pool.query(query, [
                decoded.user_id,
                hashedToken,
            ]);

            if (result.length === 0) {
                throw new CustomError(419, "Your session has expired!");
            }

            // Token is valid, return user data
            return { userId: decoded.user_id, tokenId: result[0].token_id };
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    static async revokeRefreshToken(tokenId) {
        try {
            await pool.query(
                `UPDATE tokens SET is_revoked = TRUE WHERE id = ?`,
                [tokenId]
            );
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    static async revokeRefreshTokenByUser(userId) {
        try {
            await pool.query(
                `UPDATE tokens SET is_revoked = TRUE WHERE user_id = ?`,
                [userId]
            );
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }
}

module.exports = Token;

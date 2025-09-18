const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const Staff = require("../models/staff.model");

const jwtOptions = {
    secretOrKey: config.jwt.accessSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    // console.log('🚀 ~ jwtVerify ~ payload:', payload);
    try {
        if (payload.type !== "access") {
            throw new Error("Invalid token type");
        }
        const staff = await Staff.findByUserId(payload.user_id);
        if (!staff) {
            return done(null, false);
        }
        done(null, staff);
    } catch (error) {
        done(error, false);
    }
};

const PassportJwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    PassportJwtStrategy,
};

const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string()
            .valid("production", "development", "test")
            .required(),
        PORT: Joi.number().default(8000),

        ACCESS_SECRET: Joi.string().required().description("JWT secret key"),
        REFRESH_SECRET: Joi.string().required().description("JWT secret key"),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
            .default(15)
            .description("minutes after which access tokens expire"),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
            .default(7)
            .description("days after which refresh tokens expire"),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description("minutes after which reset password token expires"),
        // EMAIL_PRIVATE_KEY: Joi.string()
        //     .required()
        //     .description("emailjs private key"),
        // EMAIL_PUBLIC_KEY: Joi.string()
        //     .required()
        //     .description("emailjs public key"),
        // EMAIL_SERVICE_ID: Joi.string()
        //     .required()
        //     .description("emailjs service id"),
        // EMAIL_USER_NAME: Joi.string()
        //     .required()
        //     .description("emailjs admin name"),
        // EMAIL_RECEPIENT: Joi.string()
        //     .email()
        //     .required()
        //     .description("emailjs recepient email"),
        // EMAIL_TEMPLATE_ID: Joi.string()
        //     .required()
        //     .description("emailjs template id"),

        DB_HOST: Joi.string().required().description("database host"),
        DB_PORT: Joi.number().default(3306),
        DB_NAME: Joi.string().required().description("database name"),
        DB_USER: Joi.string().required().description("database user"),
        DB_PASSWORD: Joi.string()
            .allow("", null)
            .description("database password"),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,

    jwt: {
        accessSecret: envVars.ACCESS_SECRET,
        refreshSecret: envVars.REFRESH_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes:
            envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    },
    // email: {
    //     private_key: envVars.EMAIL_PRIVATE_KEY,
    //     public_key: envVars.EMAIL_PUBLIC_KEY,
    //     service_id: envVars.EMAIL_SERVICE_ID,
    //     user_name: envVars.EMAIL_USER_NAME,
    //     recepient: envVars.EMAIL_RECEPIENT,
    //     temp_id: envVars.EMAIL_TEMPLATE_ID,
    // },

    db: {
        host: envVars.DB_HOST,
        port: envVars.DB_PORT,
        name: envVars.DB_NAME,
        user: envVars.DB_USER,
        password: envVars.DB_PASSWORD,
    },
};

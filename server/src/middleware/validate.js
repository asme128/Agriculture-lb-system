const Joi = require("joi");
const pick = require("../utils/pick");

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: "key" }, abortEarly: false })
        .validate(object);

    if (error) {
        // Create a combined error message
        const errorMessage = error.details
            .map((details) => details.message)
            .join(", ");

        // Send a 400 Bad Request response with the error message
        return res.status(400).json({
            status: "error",
            message: errorMessage,
        });
    }
    Object.assign(req, value);
    return next();
};

module.exports = validate;
//model -> service -> controller -> route -> validation

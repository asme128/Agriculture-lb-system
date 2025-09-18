const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const { PassportJwtStrategy } = require("./config/passport");
const config = require("./config/config");
const pool = require("./config/db");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const CustomError = require("./utils/CustomError");
const { authLimiter } = require("./middleware/rateLimiter");
const bcrypt = require('bcrypt');
const app = express();

// parse json request body
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

const allowedOrigins =
    config.env === "production"
        ? ["https://narobbina.colifye.com"] // Production origin
        : ["http://localhost:3000"]; // Local development origin

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true, // Allow credentials
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);

app.options("*", cors());
app.use(passport.initialize());

passport.use("jwt", PassportJwtStrategy);
// api routes
app.use("/api", routes);

if (config.env === "production") {
    app.use("/api/auth", authLimiter);
}

async function createHashedPassword() {
    const rawPassword = 'admin123'; // Your chosen password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    console.log('Hashed password:', hashedPassword);
}

createHashedPassword();
// Connect to MySQL
pool.getConnection()
    .then((connection) => {
        console.log("Database connection has been established successfully.");

        // Release the connection back to the pool
        connection.release();
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

const PORT = config.port || 9000;
app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});

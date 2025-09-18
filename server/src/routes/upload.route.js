const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const multer = require("multer");
const path = require("path");
const { uploadSchema } = require("../validations/upload.validation");
const uploadController = require("../controllers/upload.controller");
const auth = require("../middleware/auth");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname.startsWith("voice_")) {
            cb(null, path.join(__dirname, "..", "uploads", "voice"));
        } else if (file.fieldname.startsWith("image_")) {
            cb(null, path.join(__dirname, "..", "uploads", "images"));
        }
    },
    filename: function (req, file, cb) {
        if (file.fieldname.startsWith("voice_")) {
            const ext = path.extname(file.originalname) || ".webm"; // default to .webm
            cb(null, Date.now() + ext);
        } else {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

// Create a new project
router.post(
    "/",
    auth("2", "3"),
    upload.any(),
    validate(uploadSchema),
    uploadController.uploadFiles
);

router.delete("/", auth("2", "3"), uploadController.deleteFile);
module.exports = router;

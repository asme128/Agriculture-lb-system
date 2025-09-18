const path = require("path");
const fs = require("fs").promises;
const CustomError = require("../utils/CustomError");

const saveFile = async (file) => {
    const ext = path.extname(file.originalname);
    const isImage = file.mimetype.startsWith("image/");
    const isAudio = file.mimetype.startsWith("audio/");

    if (!isImage && !isAudio) {
        throw new Error("Unsupported file type");
    }

    const type = isImage ? "image" : "voice";

    const filePath = isImage ? "/images" : "/voice";

    return {
        fieldname: file.fieldname.replace(/^(voice_|image_)/, ""),
        filename: file.filename,
        path: "/uploads" + filePath,
        type,
        size: file.size,
    };
};

const deleteFile = async (files) => {
    const results = [];
    const errors = [];

    for (const file of files) {
        try {
            const filePath = path.join(__dirname, "..", file.value);

            await fs.unlink(filePath);
            results.push({
                filename: file.value,
                type: file.type,
                success: true,
                message: "File deleted successfully",
            });
        } catch (err) {
            errors.push({
                filename: file.value,
                type: file.type,
                success: false,
                message:
                    err.code === "ENOENT"
                        ? "File not found"
                        : "Error deleting file",
            });
        }
    }

    return {
        success: errors.length === 0,
        message: errors.length > 0 ? errors : "All files deleted successfully",
        results,
        errors: errors.length > 0 ? errors : undefined,
    };
};

module.exports = {
    saveFile,
    deleteFile,
};

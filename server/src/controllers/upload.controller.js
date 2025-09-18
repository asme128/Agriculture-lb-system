const CustomError = require("../utils/CustomError");
const uploadService = require("../services/upload.service");

const uploadFiles = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(200).json({
                message: "No image or voice files uploaded",
                data: [],
                status: 200,
            });
        }

        const uploadedFiles = await Promise.all(
            req.files.map((file) => uploadService.saveFile(file))
        );

        res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            data: uploadedFiles,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const deleteFile = async (req, res, next) => {
    try {
        const { files } = req.body;

        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new CustomError(400, "Files array is required");
        }

        // Validate each file object
        for (const file of files) {
            if (!file.value || !file.type) {
                throw new CustomError(
                    400,
                    "Each file must have filename and type"
                );
            }
            if (file.type !== "voice" && file.type !== "image") {
                throw new CustomError(
                    400,
                    "Invalid file type. Must be 'voice' or 'image'"
                );
            }
        }

        const result = await uploadService.deleteFile(files);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    uploadFiles,
    deleteFile,
};

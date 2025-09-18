const multer = require("multer");
const CustomError = require("./CustomError");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const filePath = `${__dirname}/../uploads`;
    cb(null, filePath);
  },
  filename(req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

module.exports = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(m4a|wav|ogg|mp3)$/)) {
      return cb( new CustomError(400, "Only Voice are allowed"), false);
    }
    cb(null, true);
  }
});

class CustomError extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data; // Store additional data
    // console.log('🚀 ~ CustomError ~ constructor ~ data:', this.data);
    // console.log('🚀 ~ CustomError ~ constructor ~ this:', this);
    Error.captureStackTrace(this, this.constructor);
  }

  // Method to send JSON response
  send(res) {
    const response = {
      message: this.message,
      data: this.data, // Include data only if it exists
    };

    res.status(this.statusCode).json(response);
  }
}

module.exports = CustomError;

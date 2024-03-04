class AppError extends Error {
  constructor(message, statusCode) {
    // console.log("message",message)
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = message;
    this.isOperational = true;
    console.log("this object", this);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

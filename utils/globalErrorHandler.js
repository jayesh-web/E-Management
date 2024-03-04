
const AppError = require("./appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateFieldDB = (err) => {
  //   const message = `Duplicate ${err.path}:${err.value}`;
  // const value = err.errmsg.match((["'])(?:(?=(\\?))\2.)*?\1);
  const value = err.keyValue;
  console.log("error in dups",err)
  const message = `Duplicate field value :${value} please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const value = err.errors.value;
  const errors = Object.values(err.errors).map((el) => el.path);
  console.log("errors===>>>>>", errors);
  const message = `Invalid input data ${errors.join(", ")}`;
  return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid Token. Please login again!',401)

const sendErrorDev = (err, res) => {
    console.log("error:",err)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, res) => {
    console.log("err in prod::",err)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("ERROR ", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const GloblaErrorHandler = (err, req, res, next) => {
  console.log("error stack", err.message);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error._message === "Validation failed")
      error = handleValidationError(error);
    if(error.name === "JsonWebTokenError") error= handleJWTError(error)
    sendErrorProd(error, res);
  }
};
module.exports = GloblaErrorHandler;

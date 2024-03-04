const path = require("path");
const express = require("express");
const eventTypeRouter = require("./routers/event_type_router");
const GloblaErrorHandler = require("./utils/globalErrorHandler");
const userRouter = require("./routers/user_router");
const AppError = require("./utils/appError");
const eventRouter = require("./routers/event_router");
const categoryRouter = require("./routers/eventCategory");
const UploadController = require("./controllers/uploadController");
const multer =require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();


//Body parser , reading data from body
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/eventtype", eventTypeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/category", categoryRouter);
app.post('/upload',upload.single('file'),UploadController.uploadFile);

app.use((req, res, next) => {
  console.log("middleware called");
  next();
});
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(GloblaErrorHandler);

module.exports = app;

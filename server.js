const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const port = 4000;
app.use(cors());

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION Shutting down...");
  process.exit(1);
});
dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE_LIVE;

mongoose.connect(db, { autoIndex: false }).then((con) => {
  console.log("connection",con.connection.name)
  console.log("Database connected successfully");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION  Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

const express = require("express");
const multer =require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  getAllUser,
  getMe,
  getUser,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser,
  sendMail,
} = require("../controllers/userController");
const {
  protect,
  signup,
  login,
} = require("../controllers/authorization/authController");
const {
  buyPass,
  getPasses,
  getAllPasses,
  cancelPass,
  getAllTrending,
} = require("../controllers/eventUserController");
const UploadController = require("../controllers/uploadController");

const userRouter = express.Router();

userRouter.route("/").get(getAllUser);
userRouter.route("/me").get(protect, getMe, getUser);
userRouter.route("/updateMe").patch(protect, updateMe);
userRouter.route("/deleteMe").delete(protect, deleteMe);
userRouter.route("/buyPass").post(protect, buyPass);
userRouter.route("/CancelPass").post(protect, cancelPass);

// userRouter.route("/pass").get(protect, getMe, getAllPasses);
userRouter.route("/pass").get(protect, getMe, getAllPasses);
userRouter.route("/trending").get(getAllTrending);


userRouter.route("/pass/:id").get(getPasses);

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
userRouter.route("/sendmail").post(sendMail)
   
userRouter.route('/upload',upload.single('file')).post(UploadController.uploadFile)
module.exports = userRouter;

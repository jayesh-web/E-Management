const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
} = require("../factory/handleFactory");
const UserModel = require("../models/user_model");
const EmailService = require("../services/emailNodemailer");
const catchAsync = require("../utils/catchAsync");

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
const deleteUser = deleteOne(UserModel);
const updateUser = updateOne(UserModel);
const getUser = getOne(UserModel);
const getAllUser = getAll(UserModel);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
};
const updateMe = catchAsync(async (req, res, next) => {
  console.log("file", req.file);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update.please use /updateMyPassword",
        400
      )
    );
  }
  console.log("request body=>", req.body);
  const filteredBody = filterObj(req.body, "name", "email");
  // console.log("filterbody", filteredBody, req.user.id);

  if (req.file) {
    console.log("filename", req.file.originalname);
    filteredBody.photo = req.file.filename;
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
const deleteMe = catchAsync(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({
    status: "success",
    data: null,
  });
});

const sendMail = catchAsync(async (req, res, nexr) => {
  try {
    await EmailService.sendEmail(req.body);
    res.status(201).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: "fail",
      error: error,
    });
  }
});

module.exports = {
  deleteUser,
  updateUser,
  getUser,
  getAllUser,
  getMe,
  updateMe,
  deleteMe,
  sendMail,
};

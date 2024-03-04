const { promisify } = require("util");
var jwt = require("jsonwebtoken");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const UserModel = require("../../models/user_model");
const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
} = require("../../factory/handleFactory");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const signup = catchAsync(async (req, res, next) => {
  const newUser = await UserModel.create(req.body);
  const token = signToken(newUser.id);
  res.status(201).json({
    status: "suceess",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // console.log("body", email, password);
  if (!email || !password) {
    return new AppError("Please provide email and password", 400);
  }
  //get user password
  const user = await UserModel.findOne({ email }).select("+password");
  console.log(user);
  // verify password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 400));
  }
  const token = signToken(user._id);
  console.log(token);
  res.status(200).json({
    status: "success",
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in! please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("decoded", decoded);

  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The User belonging to this token does no longer exist", 401)
    );
  }

  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. please login again.", 401)
    );
  }
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  //   console.log("roles", roles);
  return (req, res, next) => {
    console.log("role is ", req);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// const getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };
// const deleteUser = deleteOne(UserModel);
// const updateUser = updateOne(UserModel);
// const getUser = getOne(UserModel);
// const getAllUser = getAll(UserModel);

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
// };
// const updateMe = catchAsync(async (req, res, next) => {
//   console.log("file", req.file);
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not for password update.please use /updateMyPassword",
//         400
//       )
//     );
//   }
//   console.log("request body=>", req.body);
//   const filteredBody = filterObj(req.body, "name", "email");
//   console.log("filterbody", filteredBody, req.user.id);

//   if (req.file) {
//     console.log("filename", req.file.originalname);
//     filteredBody.photo = req.file.filename;
//   }

//   const updatedUser = await UserModel.findByIdAndUpdate(
//     req.user.id,
//     filteredBody,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });
// const deleteMe = catchAsync(async (req, res, next) => {
//   await UserModel.findByIdAndUpdate(req.user.id, { active: false });
//   res.status(200).json({
//     status: "success",
//     data: null,
//   });
// });

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  //   deleteUser,
  //   updateUser,
  //   getUser,
  //   getAllUser,
  //   getMe,
  //   updateMe,
  //   deleteMe,
};

const express = require("express");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const EmployeesSchema = require("../models/employeesModel");
const sendToken = require("../utils/jwtToken");
const ApiFeatures = require("../utils/apifeatures");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const createError = require("http-errors");
const cloudinary = require("cloudinary");

// Register a User
router.post(
  "/userRegister",
  catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, password, userType, organizationName, empId } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "boppo/avatars",
      width: 150,
      crop: "scale",
    });

    if (userType === "employee") {
      const user = await EmployeesSchema.create({
        firstName,
        lastName,
        email,
        organizationName,
        empId,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });

      sendToken(user, 201, res);
    } else {
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });

      sendToken(user, 201, res);
    }
  })
);

// Login User
router.post(
  "/userLogin",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.query;

    // checking if user has given password and email both

    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  })
);

// Login Employee
router.post(
  "/employeeLogin",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.query;

    // checking if user has given password and email both

    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await EmployeesSchema.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  })
);

// Logout User
router.get(
  "/userLogout",
  catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  })
);

// Get user list
router.get("/getUsersAndEmployeeList", isAuthenticatedUser, async (req, res, next) => {
  try {
    if (req.employee) {
      const resultPerPage = 10;
      const userCount = await User.countDocuments();
      const employeeCount = await EmployeesSchema.countDocuments();

      const apiFeatureUser = new ApiFeatures(User.find(), req.query);
      let userList = await apiFeatureUser.query;
      apiFeatureUser.pagination(resultPerPage);
      userList = await apiFeatureUser.query;

      const apiFeatureEmployee = new ApiFeatures(EmployeesSchema.find(), req.query);
      let employeeList = await apiFeatureEmployee.query;
      apiFeatureEmployee.pagination(resultPerPage);
      employeeList = await apiFeatureEmployee.query;

      res.status(200).json({
        success: true,
        userList,
        userCount,

        employeeList,
        employeeCount,

        resultPerPage,
      });
    } else {
      return next(new ErrorHander("Not Authorized", 401));
    }
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

module.exports = router;

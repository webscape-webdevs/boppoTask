const express = require("express");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const EmployeesSchema = require("../models/employeesModel");
const sendToken = require("../utils/jwtToken");
const router = express.Router();

// Register a User
router.post(
  "/userRegister",
  catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, password, userType, organizationName } = req.query;
    if(userType === "employee"){
      const user = await EmployeesSchema.create({
        firstName,
        lastName,
        email,
        organizationName,
        password,
      });

      sendToken(user, 201, res);

    } else {

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
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
router.get(
  "/getUsersAndEmployeeList",
  catchAsyncErrors(async (req, res, next) => {
    const userList = await User.find();
    const employeeList = await EmployeesSchema.find();

    res.status(200).json({
      success: true,
      userList,
      employeeList
    });
  })
);

module.exports = router;

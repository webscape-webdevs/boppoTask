const express = require("express");
const User = require("../models/userModel");
const EmployeesSchema = require("../models/employeesModel");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();
const createError = require("http-errors");
const sendToken = require("../utils/jwtToken");
const ErrorHander = require("../utils/errorhander");
const cloudinary = require("cloudinary");

// Get Session
router.get("/getSession", isAuthenticatedUser, async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user.id);

      res.status(200).json({
        success: true,
        user,
      });
    } else if (req.employee) {
      const user = await EmployeesSchema.findById(req.employee.id);

      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

// Register a User
router.post("/userRegister", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, userType, organizationName } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "boppo/avatars",
      width: 150,
      crop: "scale",
    });
    console.log("hii");
    if (userType === "employee") {
      const user = await EmployeesSchema.create({
        firstName,
        lastName,
        email,
        organizationName,
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
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

// Login User
router.post("/userLogin", async (req, res, next) => {
  try {
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
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

// Login Employee
router.post("/employeeLogin", async (req, res, next) => {
  try {
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
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

// Logout User
router.get("/userLogout", async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

module.exports = router;

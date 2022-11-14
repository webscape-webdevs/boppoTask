const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const EmployeesSchema = require("../models/employeesModel");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();
const createError = require("http-errors");

// Get User
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

module.exports = router;

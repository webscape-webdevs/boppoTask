const express = require("express");
const User = require("../models/userModel");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

// Deposite
router.put("/deposite", isAuthenticatedUser, async (req, res, next) => {
  try {
    if (req.user) {
      const { amount, password } = req.query;

      if (!amount || !password) {
        return next(new ErrorHander("Please Enter Amount & Password", 400));
      }

      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return next(new ErrorHander("Please Login", 401));
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
      }

      const finalBalance = user.balance + parseInt(amount);

      const deposite = await User.findOneAndUpdate({ _id: req.user.id }, { balance: finalBalance });

      res.status(200).json({ finalBalance });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

// Withdraw
router.put("/withdraw", isAuthenticatedUser, async (req, res, next) => {
  try {
    if (req.user) {
      const { amount, password } = req.query;

      if (!amount || !password) {
        return next(new ErrorHander("Please Enter Amount & Password", 400));
      }

      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return next(new ErrorHander("Please Login", 401));
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
      }

      const finalBalance = user.balance - parseInt(amount);

      const deposite = await User.findOneAndUpdate({ _id: req.user.id }, { balance: finalBalance });

      res.status(200).json({ finalBalance });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

module.exports = router;

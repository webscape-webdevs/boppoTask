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
const { findOneAndDelete } = require("../models/userModel");
const cloudinary = require("cloudinary");

// Delete a User
router.delete("/deleteUserOrEmployee", isAuthenticatedUser, async (req, res, next) => {
  try {
    if (req.employee) {
      const { userId, userType } = req.query;

      if (userType === "user") {
        const deletedUser = await User.findOneAndDelete({ _id: userId });

        res.status(201).json({ deletedUser });
      } else if (userType === "employee") {
        const deletedUser = await EmployeesSchema.findOneAndDelete({
          _id: userId,
        });

        res.status(201).json({ deletedUser });
      }
    } else {
      return next(new ErrorHander("Not Authorized", 401));
    }
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

router.put("/updateUserOrEmployee", isAuthenticatedUser, async (req, res, next) => {
  try {
    if (req.employee) {
      const { userId, userType, firstName, lastName, email, organizationName, publicId } = req.body;
    

        if(publicId !== ""){
      
          await cloudinary.v2.uploader.destroy(publicId);
    
        }
     
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "boppo/avatars",
          width: 150,
          crop: "scale",
        });
      



      if (userType === "user") {
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $set: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              },
            },
          },
          {
            new: true,
            upsert: true,
            returnNewDocument: true,
          }
        );

        res.status(201).json({ updatedUser });
      } else if (userType === "employee") {
        const updatedUser = await EmployeesSchema.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $set: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              organizationName: organizationName,
              avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              },
            },
          },
          {
            new: true,
            upsert: true,
            returnNewDocument: true,
          }
        );

        res.status(201).json({ updatedUser });
      }
    } else {
      return next(new ErrorHander("Not Authorized", 401));
    }
  } catch (error) {
    return next(createError.InternalServerError(error));
  }
});

module.exports = router;

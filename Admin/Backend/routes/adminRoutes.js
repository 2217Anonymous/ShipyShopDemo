const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  loginOTP,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  updatePassord,
  updatePattern,
} = require("../controller/adminController");
const { passwordVerificationLimit } = require("../lib/email-sender/sender");
const { isAuth } = require("../config/auth");

// register a staff
// router.post("/register", registerAdmin);

//login otp a admin
// router.post("/loginotp", loginOTP);

//login a admin
router.post("/login", loginAdmin);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//add a staff
router.post("/add"/*, isAuth*/, addStaff);

//get all staff
router.get("/", getAllStaff);

// post route here

//change password
router.post("/updatepassord", isAuth, updatePassord);

//change pattern
router.post("/updatepattern", isAuth, updatePattern);

// post route here

//get a staff
router.post("/:id", isAuth, getStaffById);

//update a staff
router.put("/:id", isAuth, updateStaff);

//update staf status
router.put("/update-status/:id"/*, isAuth*/, updatedStatus);

//delete a staff
router.delete("/:id"/*, isAuth*/, deleteStaff);

module.exports = router;
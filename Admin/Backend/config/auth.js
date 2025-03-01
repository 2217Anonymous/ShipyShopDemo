require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const sendResponse = require("../guider/sendResponse");
const encode = require("../guider/encode");

const signInToken = (user) => {  
  return jwt.sign(
    {
      AdminId: user.AdminId,
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
      role: user.role

    },
    global.JWT_SECRET,
    {
      expiresIn: global.JWT_EXPIRE,
    }
  );
};

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    global.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    let token   = authorization.split(" ")[1];
          token = await encode.decrypt(token);
    const decoded = jwt.verify(token, global.JWT_SECRET);
    req.user      = decoded;
    next();
  } catch (err) {
    let returnValue = {code:401,status:false,message:"Unauthorized Access"};
    sendResponse.sendJson(returnValue,res);
  }
};

const isAdmin = async (req, res, next) => {
  const admin = await Admin.findOne({ role: "Admin" });
  if (admin) {
    next();
  } else {
    res.status(401).send({
      message: "User is not Admin",
    });
  }
};

module.exports = {
  signInToken,
  tokenForVerify,
  isAuth,
  isAdmin,
};

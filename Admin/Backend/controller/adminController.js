const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const browser  = require('browser-detect');
const { signInToken, tokenForVerify, sendEmail } = require("../config/auth");
const isCheck = require("../guider/i2aNKmqBUD");
const adminActivity = require("../guider/adminActivity");
const sendResponse = require("../guider/sendResponse");
const encode = require("../guider/encode");
const Admin = require("../models/Admin");
const  {sendemail}  = require("../lib/email-sender/sender");
const emailTemplate = require('../models/emalTemplate')

const registerAdmin = async (req, res) => {
  // try {
  //   const isAdded = await Admin.findOne({ email: req.body.email });
  //   if (isAdded) {
  //     return res.status(403).send({
  //       message: "This Email already Added!",
  //     });
  //   } else {
  //     const newStaff = new Admin({
  //       name: req.body.name,
  //       email: req.body.email,
  //       role: req.body.role,
  //       password: bcrypt.hashSync(req.body.password),
  //     });
  //     const staff = await newStaff.save();
  //     let token = signInToken(staff);
  //         token = encode.encrypt(token);
  //     res.send({
  //       token,
  //       _id: staff._id,
  //       name: staff.name,
  //       email: staff.email,
  //       role: staff.role,
  //       joiningData: Date.now(),
  //     });
  //   }
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const loginOTP = async (req, res) => {
  // try {
  //   let ipAddr  = await isCheck.getIpadderss(req);
  //   const admin = await Admin.findOne({ email: req.body.email });
    
  //   if (admin && bcrypt.compareSync(req.body.password, admin.password) && bcrypt.compareSync(req.body.pattern, admin.pattern)) {
  //     let otp     = "123456";
  //     let expire  = new Date()
  //         expire.setMinutes(expire.getMinutes() + 3)
  //     let currDate = new Date(Date.now())
      
  //     let currentTime  = currDate.getTime();
  //     let emailExpire  = (admin.otpExp) ? admin.otpExp : currDate;
      
  //     let expireTime   = emailExpire.getTime();
      
  //     if(currentTime >= expireTime){
  //       admin.otp     = bcrypt.hashSync(otp);
  //       admin.otpExp  = expire;

  //       await admin.save();
  //       let description = `Sending login otp`;

  //       await adminActivity.adminActivity(admin._id,`Send-OTP`, description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os);

  //       // const template = await emailTemplate.findOne({ templateName: "loginOtp" })

  //       // let templateContent = template.content.replace('###Title###', template.subject)
  //       //   .replace('###content###', `Verify your email address to complete the signup and login into your account.<br>This OTP will expire in 3 minute.`)
  //       //   .replace('###otp###', otp)

  //       // let option = {
  //       //   toemail: req.body.email,
  //       //   html: templateContent,
  //       //   subject: template.subject
  //       // }
  //       let returnValue = {status:true,message:"OTP sent",value:{expireTime:expire,curentTime:currDate} };

  //       // return sendemail(option, res, returnValue);

  //       return true

  //     }else{
  //       let returnValue = { status : false, message : "OTP alredy sent to your email address" ,value:{expireTime:emailExpire, curentTime:currDate}};
  //       return res.json({ payload : returnValue });
  //     }
  //   } else {
  //     let description = `Invaild credentials trying email ${req.body.email} password ${req.body.password} pattern ${req.body.pattern}`
  //     await adminActivity.adminActivity(req.body.email,"ERROR-LOG", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,'')
  //     let returnValue = {status:false,message:"Invalid login details!"};
  //     res.json({ payload : returnValue})
  //   }
  // } catch (err) {
    
  //   let returnValue = {status:false,message:err};
  //   res.json({ payload : returnValue})
  // }
};

const loginAdmin = async (req, res) => {
  try {
    let ipAddr  = await isCheck.getIpadderss(req);
    const admin = await Admin.findOne({ email: req.body.email });
    
    if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
      let token = signInToken(admin);        
          token = await encode.encrypt(token);
                 await admin.updateOne({'$set':{'otp':'',otpExp:''}}).exec()
      let returnValue = {status:true,message:"Login successful!", values:{
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,

      }};
      sendResponse.sendJson(returnValue,res);
    } else {
      let description = `Invaild credentials trying email ${req.body.email} password ${req.body.password} pattern ${req.body.pattern}`
      await adminActivity.adminActivity(req.body.email,"ERROR-LOG", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,'');

      let returnValue = {status:false,message:"Invalid login details!"};
      sendResponse.sendJson(returnValue,res);
    }
  } catch (err) {    
    let returnValue = {status:false,message:err.message};
    sendResponse.sendJson(returnValue,res);
  }
};

const forgetPassword = async (req, res) => {
  // const isAdded = await Admin.findOne({ email: req.body.verifyEmail });
  // if (!isAdded) {
  //   return res.status(404).send({
  //     message: "Admin/Staff Not found with this email!",
  //   });
  // } else {
  //   const token = tokenForVerify(isAdded);
  //   const body = {
  //     from: process.env.EMAIL_USER,
  //     to: `${req.body.verifyEmail}`,
  //     subject: "Password Reset",
  //     html: `<h2>Hello ${req.body.verifyEmail}</h2>
  //     <p>A request has been received to change the password for your <strong>Dashtar</strong> account </p>

  //       <p>This link will expire in <strong> 15 minute</strong>.</p>

  //       <p style="margin-bottom:20px;">Click this link for reset your password</p>

  //       <a href=${process.env.ADMIN_URL}/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>

        
  //       <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@dashtar.com</p>

  //       <p style="margin-bottom:0px;">Thank you</p>
  //       <strong>Dashtar Team</strong>
  //            `,
  //   };
  //   const message = "Please check your email to reset password!";
  //   sendEmail(body, res, message);
  // }
};

const resetPassword = async (req, res) => {
  // const token = req.body.token;
  // const { email } = jwt.decode(token);
  // const staff = await Admin.findOne({ email: email });

  // if (token) {
  //   jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
  //     if (err) {
  //       return res.status(500).send({
  //         message: "Token expired, please try again!",
  //       });
  //     } else {
  //       staff.password = bcrypt.hashSync(req.body.newPassword);
  //       staff.save();
  //       res.send({
  //         message: "Your password change successful, you can login now!",
  //       });
  //     }
  //   });
  // }
};

const addStaff = async (req, res) => {
  // try {
  //   const isAdded = await Admin.findOne({ email: req.body.staffData.email });
  //   if (isAdded) {
  //     return res.status(500).send({
  //       message: "This Email already Added!",
  //     });
  //   } else {
  //     const newStaff = new Admin({
  //       name: { ...req.body.staffData.name },
  //       email: req.body.staffData.email,
  //       password: bcrypt.hashSync(req.body.staffData.password),
  //       phone: req.body.staffData.phone,
  //       joiningDate: req.body.staffData.joiningDate,
  //       role: req.body.staffData.role,
  //       image: req.body.staffData.image,
  //     });
  //     await newStaff.save();
  //     res.status(200).send({
  //       message: "Staff Added Successfully!",
  //     });
  //   }
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const getAllStaff = async (req, res) => {
  // try {
  //   const admins = await Admin.find({}).sort({ _id: -1 });
  //   res.send(admins);
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const getStaffById = async (req, res) => {
  try {
    // let id = atob(req.params.id);
    let id    = req.user._id;
    const admin = await Admin.findById(id);
    let resValue = {
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone,
                    image: admin.image
                  }
    let returnValue = {status:true,message:"",value:resValue};
    sendResponse.sendJson(returnValue,res);
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.sendJson(returnValue,res);
  }
};

const updateStaff = async (req, res) => {
  try {
    // let id = atob(req.params.id);
    let id    = req.user._id;
    const admin = await Admin.findOne({ _id: id });
    if (admin) {
      // Updating Master Record - CCDev
      // admin.name = { ...admin.name, ...req.body.name };
      admin.name = req.body.name;
      // admin.email = req.body.email;
      admin.phone = req.body.phone;
      // admin.role = req.body.role;
      // admin.userstatus = req.body.userstatus;
      // admin.userpin = req.body.userpin;
      // admin.joiningData = req.body.joiningDate;
      // admin.forcepwreset = false;
      // admin.password =
      //   req.body.password !== undefined
      //     ? bcrypt.hashSync(req.body.password)
      //     : admin.password;
      // admin.password = bcrypt.compareSync(
      //   req.body.password,
      //   admin.password
      // )
      //   ? admin.password
      //   : bcrypt.hashSync(req.body.password);

      admin.image = req.body.image;
      const updatedAdmin = await admin.save();
      let token = signInToken(updatedAdmin);
          // token = encode.encrypt(token);

      let description = `Profile updated successfully`;
      await adminActivity.adminActivity(admin.name,"updateProfile", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)

      let resValue = {
                        token,
                        name: updatedAdmin.name,
                        email: updatedAdmin.email,
                        phone: updatedAdmin.phone,
                        image: updatedAdmin.image
                      }

      let returnValue = {status:true,message:description,value:resValue};
      sendResponse.sendJson(returnValue,res);
    } else {
      let description = `Invalid Access`;
      await adminActivity.adminActivity(id,"updateProfile-Error", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)

      let returnValue = {status:false,message:description};
      sendResponse.sendJson(returnValue,res);
    }
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.sendJson(returnValue,res);
  }
};

const deleteStaff = (req, res) => {
  // Admin.deleteOne({ _id: req.params.id }, (err) => {
  //   if (err) {
  //     res.status(500).send({
  //       message: err.message,
  //     });
  //   } else {
  //     res.status(200).send({
  //       message: "Admin Deleted Successfully!",
  //     });
  //   }
  // });
};

const updatedStatus = async (req, res) => {
  // try {
  //   const newStatus = req.body.status;

  //   await Admin.updateOne(
  //     { _id: req.params.id },
  //     {
  //       $set: {
  //         status: newStatus,
  //       },
  //     }
  //   );
  //   res.send({
  //     message: `Store ${newStatus} Successfully!`,
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const updatePassord = async (req, res) => {
  try {
    let value = req.body;
    let id    = req.user._id;
    let currentPassword = value.currentPassword;
    let newPassword     = value.newPassword;
    let conformPassword = value.conformPassword;
    let ipAddr          = await isCheck.getIpadderss(req);
    const admin         = await Admin.findOne({ _id: id });
    if (admin && bcrypt.compareSync(currentPassword, admin.password) ) {
      if(currentPassword == newPassword){
        let description = `Currenct and New password must not be same`;
        await adminActivity.adminActivity(admin.name,"ChangePassword-Error", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)
        let returnValue = {status:false,message:description};
        sendResponse.sendJson(returnValue,res);
      }else{
        if(newPassword == conformPassword){
            admin.password = bcrypt.hashSync(newPassword);
            const updatedAdmin = await admin.save();

            let description = `Password has been updated`;
            await adminActivity.adminActivity(admin.name,"ChangePassword", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)
            let returnValue = {status:true,message:description};
            sendResponse.sendJson(returnValue,res);
          
        }else{
          let description = `New and Conform password must be same`;
          await adminActivity.adminActivity(admin.name,"ChangePassword-Error", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)

          let returnValue = {status:false,message:description};
          sendResponse.sendJson(returnValue,res);
          
        }
      }
    } else {
      let description = `Invaild Access`;
      await adminActivity.adminActivity(id,"ChangePassword-Error", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)

      let returnValue = {status:false,message:"Invalid details"};
      sendResponse.sendJson(returnValue,res);
    }
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.sendJson(returnValue,res);
  }
};

const updatePattern = async (req, res) => {
  try {
    let value = req.body;
    let id    = req.user._id;
    let oldPattern  = value.oldPattern;
    let newPattern  = value.newPattern;
    let ipAddr          = await isCheck.getIpadderss(req);
    const admin         = await Admin.findOne({ _id: id });
    if(admin && bcrypt.compareSync(oldPattern, admin.pattern) ){
      if(oldPattern == newPattern){
        let description = `Old and New Pattern must not be same`;
        await adminActivity.adminActivity(admin.name,"ChangePattern-Error", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)

        let returnValue = {status:false,message:description};
        sendResponse.sendJson(returnValue,res);
      }else{
        admin.pattern   = bcrypt.hashSync(newPattern);
        const updatedAdmin = await admin.save();
        let description = `Pattern has been updated`;
        await adminActivity.adminActivity(admin.name,"ChangePattern", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)
        let returnValue = {status:true,message:description};
        sendResponse.sendJson(returnValue,res);
      }
    } else {
      let description = `Invaild Access`;
          await adminActivity.adminActivity(id,"ChangePattern-Error", description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,id)
      let returnValue = {status:false,message:"Invalid details"};
      sendResponse.sendJson(returnValue,res);
    }
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.sendJson(returnValue,res);
  }
};

module.exports = {
  registerAdmin,
  loginOTP,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatePassord,
  updatePattern,
  updatedStatus,
};

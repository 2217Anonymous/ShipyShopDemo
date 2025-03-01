require("dotenv").config();
const Customer = require("../models/Customer");
const RefAmount = require("../models/RefferelAmount");

const sendResponse = require("../guider/sendResponse");
const encode = require("../guider/encode");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { signInToken, tokenForVerify } = require("../config/auth");
// const { sendEmail } = require("../lib/email-sender/sender");
// const {
//   customerRegisterBody,
// } = require("../lib/email-sender/templates/register");
// const {
//   forgetPasswordEmailBody,
// } = require("../lib/email-sender/templates/forget-password");
const verifyEmailAddress = async (req, res) => {
  // const isAdded = await Customer.findOne({ email: req.body.email });
  // if (isAdded) {
  //   return res.status(403).send({
  //     message: "This Email already Added!",
  //   });
  // } else {
  //   const token = tokenForVerify(req.body);
  //   const option = {
  //     name: req.body.name,
  //     email: req.body.email,
  //     token: token,
  //   };
  //   const body = {
  //     from: process.env.EMAIL_USER,
  //     to: `${req.body.email}`,
  //     subject: "Email Activation",
  //     subject: "Verify Your Email",
  //     html: customerRegisterBody(option),
  //   };

  //   const message = "Please check your email to verify your account!";
  //   sendEmail(body, res, message);
  // }
};

const registerCustomer = async (req, res) => {
  // const token = req.params.token;
  // const { name, email, password } = jwt.decode(token);
  // const isAdded = await Customer.findOne({ email: email });

  // if (isAdded) {
  //   const token = signInToken(isAdded);
  //   return res.send({
  //     token,
  //     _id: isAdded._id,
  //     name: isAdded.name,
  //     email: isAdded.email,
  //     message: "Email Already Verified!",
  //   });
  // }

  // if (token) {
  //   jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
  //     if (err) {
  //       return res.status(401).send({
  //         message: "Token Expired, Please try again!",
  //       });
  //     } else {
  //       const newUser = new Customer({
  //         name,
  //         email,
  //         password: bcrypt.hashSync(password),
  //       });
  //       newUser.save();
  //       const token = signInToken(newUser);
  //       res.send({
  //         token,
  //         _id: newUser._id,
  //         name: newUser.name,
  //         email: newUser.email,
  //         message: "Email Verified, Please Login Now!",
  //       });
  //     }
  //   });
  // }
};

const addAllCustomers = async (req, res) => {
  // try {
  //   await Customer.deleteMany();
  //   await Customer.insertMany(req.body);
  //   res.send({
  //     message: "Added all users successfully!",
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const loginCustomer = async (req, res) => {
  // try {
  //   const customer = await Customer.findOne({ email: req.body.registerEmail });

  //   if (
  //     customer &&
  //     customer.password &&
  //     bcrypt.compareSync(req.body.password, customer.password)
  //   ) {
  //     const token = signInToken(customer);
  //     res.send({
  //       token,
  //       _id: customer._id,
  //       name: customer.name,
  //       email: customer.email,
  //       address: customer.address,
  //       phone: customer.phone,
  //       image: customer.image,
  //     });
  //   } else {
  //     res.status(401).send({
  //       message: "Invalid user or password!",
  //     });
  //   }
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const forgetPassword = async (req, res) => {
  // const isAdded = await Customer.findOne({ email: req.body.verifyEmail });
  // if (!isAdded) {
  //   return res.status(404).send({
  //     message: "User Not found with this email!",
  //   });
  // } else {
  //   const token = tokenForVerify(isAdded);
  //   const option = {
  //     name: isAdded.name,
  //     email: isAdded.email,
  //     token: token,
  //   };

  //   const body = {
  //     from: process.env.EMAIL_USER,
  //     to: `${req.body.verifyEmail}`,
  //     subject: "Password Reset",
  //     html: forgetPasswordEmailBody(option),
  //   };

  //   const message = "Please check your email to reset password!";
  //   sendEmail(body, res, message);
  // }
};

const resetPassword = async (req, res) => {
  // const token = req.body.token;
  // const { email } = jwt.decode(token);
  // const customer = await Customer.findOne({ email: email });

  // if (token) {
  //   jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
  //     if (err) {
  //       return res.status(500).send({
  //         message: "Token expired, please try again!",
  //       });
  //     } else {
  //       customer.password = bcrypt.hashSync(req.body.newPassword);
  //       customer.save();
  //       res.send({
  //         message: "Your password change successful, you can login now!",
  //       });
  //     }
  //   });
  // }
};

const changePassword = async (req, res) => {
  // try {
  //   const customer = await Customer.findOne({ email: req.body.email });
  //   if (!customer.password) {
  //     return res.send({
  //       message:
  //         "For change password,You need to sign in with email & password!",
  //     });
  //   } else if (
  //     customer &&
  //     bcrypt.compareSync(req.body.currentPassword, customer.password)
  //   ) {
  //     customer.password = bcrypt.hashSync(req.body.newPassword);
  //     await customer.save();
  //     res.send({
  //       message: "Your password change successfully!",
  //     });
  //   } else {
  //     res.status(401).send({
  //       message: "Invalid email or current password!",
  //     });
  //   }
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const signUpWithProvider = async (req, res) => {
  // try {
  //   // const { user } = jwt.decode(req.body.params);
  //   const user = jwt.decode(req.params.token);

  //   const isAdded = await Customer.findOne({ email: user.email });
  //   if (isAdded) {
  //     const token = signInToken(isAdded);
  //     res.send({
  //       token,
  //       _id: isAdded._id,
  //       name: isAdded.name,
  //       email: isAdded.email,
  //       address: isAdded.address,
  //       phone: isAdded.phone,
  //       image: isAdded.image,
  //     });
  //   } else {
  //     const newUser = new Customer({
  //       name: user.name,
  //       email: user.email,
  //       image: user.picture,
  //     });

  //     const signUpCustomer = await newUser.save();
  //     const token = signInToken(signUpCustomer);
  //     res.send({
  //       token,
  //       _id: signUpCustomer._id,
  //       name: signUpCustomer.name,
  //       email: signUpCustomer.email,
  //       image: signUpCustomer.image,
  //     });
  //   }
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const getAllCustomers_old = async (req, res) => {
  try {
    const users = await Customer.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    let data = req.body
    let searchText = data.searchText ? data.searchText : ""
    let page = data.page ? data.page : 1
    let limit = data.limit ? data.limit : 0

    let queryObject = {};
    if (searchText.length > 0) {
      queryObject.$or = [
        { "name": { $regex: `${searchText}`, $options: "i" } },
        { "phoneno": { $eq: searchText.trim() } },
        { "email": { $eq: await encode.encrypt(searchText.trim()) } }
      ]
    }

    const pages = +(page);
    const limits = +(limit);
    const skip = (pages - 1) * limits;

    const [users, count] = await Promise.all([
      await Customer.find(queryObject).sort({ createdAt: -1 }).skip(skip).limit(limits).exec(),
      await Customer.countDocuments().exec()
    ])
    let arr = []
    for (let i = 0; i < users.length; i++) {
      let object = {
        _id: users[i]._id,
        name: users[i].name,
        email: await encode.decrypt(users[i].email),
        phoneno: users[i].phoneno,
        addressDetails: users[i].addressDetails,
        createdAt: users[i].createdAt,
        updatedAt: users[i].updatedAt,
        id: users[i]._id,


      }
      arr.push(object)

    }

    let returnValue = { status: true, message: "", details: arr, limits, pages, totalDoc: count };

    return sendResponse.sendJson(returnValue, res);

    // // token = await encode.encrypt(token);
    //   const { searchText, page, limit } = req.query;
    //   let queryObject = {};
    //   let sortObject = {};
    //   if (searchText) {
    //     queryObject.$or = [
    //       { "name": { $regex: `${searchText}`, $options: "i" } },
    //       { "phoneno": { $regex: `${searchText}`, $options: "i" } },
    //       { "email": { $regex: `${await encode.userEncrypt(searchText)}`, $options: "i" } },
    //     ];
    //   }

    //   // if (price === "low") {
    //   //   sortObject = {
    //   //     "prices.originalPrice": 1,
    //   //   };
    //   // } else if (price === "high") {
    //   //   sortObject = {
    //   //     "prices.originalPrice": -1,
    //   //   };
    //   // } else if (price === "published") {
    //   //   queryObject.status = "show";
    //   // } else if (price === "unPublished") {
    //   //   queryObject.status = "hide";
    //   // } else if (price === "status-selling") {
    //   //   queryObject.stock = { $gt: 0 };
    //   // } else if (price === "status-out-of-stock") {
    //   //   queryObject.stock = { $lt: 1 };
    //   // } else if (price === "date-added-asc") {
    //   //   sortObject.createdAt = 1;
    //   // } else if (price === "date-added-desc") {
    //   //   sortObject.createdAt = -1;
    //   // } else if (price === "date-updated-asc") {
    //   //   sortObject.updatedAt = 1;
    //   // } else if (price === "date-updated-desc") {
    //   //   sortObject.updatedAt = -1;
    //   // } else {
    //     sortObject = { _id: -1 };
    //   // }


    //   // if (category) {
    //   //   queryObject.categories = category;
    //   // }

    //   const pages = Number(page);
    //   const limits = Number(limit);
    //   const skip = (pages - 1) * limits;

    //   try {

    //     const totalDoc = await Customer.countDocuments(queryObject);

    //     const users = await Customer.find(queryObject)
    //       .sort(sortObject)
    //       .skip(skip)
    //       .limit(limits);

    //     // res.send({
    //     //   users,
    //     //   totalDoc,
    //     //   limits,
    //     //   pages,
    //     // });
    //     let value = {users,totalDoc,limits,pages}

    //     let returnValue = {status:true,message:"", values:value};
    //     sendResponse.sendJson(returnValue,res);
    //   } catch (err) {
    //     // consoe.log("error", err);
    //     res.status(500).send({
    //       message: err.message,
    //     });
    //   }

  } catch (err) {
    return sendResponse.sendJson({ status: false, message: err.message }, res)
  }
};
const getCustomerById = async (req, res) => {
  try {
    const id = req.body.id
    const customer = await Customer.findById(id);

    if (customer) {
      const customerDetails = {
        name: customer.name,
        email: await encode.decrypt(customer.email),
        phoneno: customer.phoneno,
        addressDetails: customer?.addressDetails ? customer?.addressDetails[0] : [],
        bankDetails: customer?.bankDetails ? customer?.bankDetails[0] : [],
        userStatus: customer?.userStatus,
        referralDetails: customer?.referralDetails

      }

      res.send(customerDetails);
    } else {
      return sendResponse.sendJson({ status: true, message: 'No data found' }, res)

    }
  } catch (err) {
    return sendResponse.sendJson({ status: false, message: err.message }, res);
  }
};

const updateCustomer = async (req, res) => {
  // return;
  try {
    const { id, name, email, addressDetails, phone, image } = req.body;

    const customer = await Customer.findById(id);
    if (customer) {
      await Customer.updateOne({ _id: id }, {
        $set: { name: name, email: email, addressDetails: addressDetails, phone: phone, image: image }
      }).then(async (result, err) => {
        if (err) {
          return sendJson({ status: false, message: "User details updation error" }, res)
        } else {
          return sendJson({ status: true, message: 'User details updated successfully!' }, res)
        }
      })

    } else {
      return sendResponse.sendJson({ status: false, message: "User not found" }, res);

    }
  } catch (err) {
    res.status(404).send({
      message: "Your email is not valid!",
    });
  }
};

const deleteCustomer = (req, res) => {
  // Customer.deleteOne({ _id: req.params.id }, (err) => {
  //   if (err) {
  //     res.status(500).send({
  //       message: err.message,
  //     });
  //   } else {
  //     res.status(200).send({
  //       message: "User Deleted Successfully!",
  //     });
  //   }
  // });
};

const updateCusStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const customer = await Customer.findById(id);
    if (customer && customer.userStatus != status) {
      await Customer.updateOne({ _id: id }, {
        $set: { userStatus: status }
      }).then(async (result, err) => {
        if (err) {
          return sendResponse.sendJson({ status: false, message: "User status updation error" }, res)
        } else {
          return sendResponse.sendJson({ status: true, message: 'User status updated successfully' }, res)
        }
      })

    } else {
      let msg = !customer ? "User not found" : ""
      msg = customer.userStatus == status ? "Already updated" : msg

      return sendResponse.sendJson({ status: false, message: msg }, res);
    }
  } catch (err) {
    return sendResponse.sendJson({ status: false, message: "something went wrong" }, res);
  }
};

//Aparna
const AdminRefWdTicket = async (req, res) => {
  try {

    var data = await RefAmount.find({ type: { $in: [1, 2] } }).sort({ createdAt: -1 })
    var Count = await RefAmount.countDocuments({ type: { $in: [1, 2] } })

    if (data && data.length > 0) {
      return sendResponse.sendJson({ status: true, message: 'Success', data: data, totalDoc: Count }, res)
    } else {
      return sendResponse.sendJson({ status: false, message: "No Data Found!!" }, res);
    }

  } catch (e) {
    return sendResponse.sendJson({ status: false, message: "something went wrong" }, res);
  }
}

const AdminRefWdFindOne = async (req, res) => {
  try {

    var _id = req.body._id

    var data = await RefAmount.findOne({ _id: _id, type: { $in: [1, 2] } })

    if (data && data !== null) {
      return sendResponse.sendJson({ status: true, message: 'Success', data: data }, res)
    } else {
      return sendResponse.sendJson({ status: false, message: "No Data Found!!" }, res);
    }

  } catch (e) {
    return sendResponse.sendJson({ status: false, message: "something went wrong" }, res);
  }
}


const AdminRefWdUpdate = async (req, res) => {
  try {

    var _id = req.body._id
    let status = req.body.status
    status = (status == 0) ? 2 : 3

    let Status1 = status == 2 ? 1 : 2
    let reason = req.body.reason
    reason = reason ? reason : ''

    var data = await RefAmount.findOne({ _id: _id, })

    if (data.type == 2) {
      return sendResponse.sendJson({ status: false, message: "Already Approved!!" }, res);
    } else if (data.type == 3) {
      return sendResponse.sendJson({ status: false, message: "Already Rejected!!" }, res);
    }

    if (data && data !== null && data.type == 1) {

      await RefAmount.updateOne({ _id: _id }, {
        $set: {
          type: status,
          reason: reason,
          Status: Status1
        }
      })
      return sendResponse.sendJson({ status: true, message: 'Updated Successfully!!' }, res)
    } else {
      return sendResponse.sendJson({ status: false, message: "No Data Found!!" }, res);
    }

  } catch (e) {
    return sendResponse.sendJson({ status: false, message: "something went wrong" }, res);
  }
}


const AdminCommissionFee = async (req, res) => {
  try {

    var status = parseFloat(req.body.status)
    var data = await RefAmount.find({ type: status })
    var Count = await RefAmount.countDocuments({ type: status })

    if (data && data.length > 0) {
      return sendResponse.sendJson({ status: true, message: 'Success', data: data, totalDoc: Count }, res)
    } else {
      return sendResponse.sendJson({ status: false, message: "No Data Found!!" }, res);
    }

  } catch (e) {
    return sendResponse.sendJson({ status: false, message: "something went wrong" }, res);
  }
}

module.exports = {
  loginCustomer,
  registerCustomer,
  addAllCustomers,
  signUpWithProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updateCusStatus,
  AdminRefWdTicket,
  AdminRefWdUpdate,
  AdminCommissionFee,
  AdminRefWdFindOne
};

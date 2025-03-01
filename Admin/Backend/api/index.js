require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
var logger = require('morgan');

fcsjnm();

function fcsjnm(){  
  global.dbURI                  = process.env.MONGO_URI;
  global.JWT_EXPIRE             = process.env.JWT_EXPIRE;
  global.JWT_SECRET             = process.env.JWT_SECRET;
  global.JWT_SECRET_FOR_VERIFY  = process.env.JWT_SECRET_FOR_VERIFY;
  global.encryptKey             = process.env.eulaVyektpyrcne;
  global.encryptIv              = process.env.eulaVvitpyrcne;
  global.userEncryptKey         = process.env.eulaVyektpyrcne;
  global.userEncryptIv          = process.env.eulaVvitpyrcne;
  global.payEncryptKey          = process.env.eulaVyektpyrcnEyap;
  global.payEncryptIv           = process.env.eulaVvitpyrcnEyap;
  global.SERVICE                = process.env.SERVICE;
  global.EMAIL_USER             = process.env.EMAIL_USER;
  global.EMAIL_PASS             = process.env.EMAIL_PASS;
  global.HOST                   = process.env.HOST;
  global.EMAIL_PORT             = process.env.EMAIL_PORT;
  startServer();
}

function startServer() {
  const { connectDB } = require("../config/db");
  const productRoutes = require("../routes/productRoutes");
  const customerRoutes = require("../routes/customerRoutes");
  const adminRoutes = require("../routes/adminRoutes");
  const orderRoutes = require("../routes/orderRoutes");
  const customerOrderRoutes = require("../routes/customerOrderRoutes");
  const categoryRoutes = require("../routes/categoryRoutes");
  const couponRoutes = require("../routes/couponRoutes");
  const attributeRoutes = require("../routes/attributeRoutes");
  const settingRoutes = require("../routes/settingRoutes");
  const currencyRoutes = require("../routes/currencyRoutes");
  const languageRoutes = require("../routes/languageRoutes");
  const { isAuth, isAdmin } = require("../config/auth");
  const templeteRoutes = require('../routes/templeteRoutes')
  const blogRouters = require('../routes/blogRoutes')
  const sellerRouters = require('../routes/sellerRoutes')

  connectDB();
  const app = express();

  // We are using this for the express-rate-limit middleware
  // See: https://github.com/nfriedly/express-rate-limit
  // app.enable('trust proxy');
  app.set("trust proxy", 1);

  app.use(express.json({ limit: "4mb" }));
  app.use(helmet());
  app.use(cors());
  app.use(logger('dev'));

  //root route
  app.get("/", (req, res) => {
    res.send("App works properly!");
  });

  //this for route will need for store front, also for admin dashboard
  app.use("/api/products/", productRoutes);
  app.use("/api/category/", categoryRoutes);
  app.use("/api/coupon/", couponRoutes);
  app.use("/api/customer/", customerRoutes);
  app.use("/api/order/", isAuth, customerOrderRoutes);
  app.use("/api/attributes/", attributeRoutes);
  app.use("/api/setting/", settingRoutes);
  app.use("/api/currency/", isAuth, currencyRoutes);
  app.use("/api/language/", languageRoutes);
  app.use('/api/templete/', templeteRoutes)
  //if you not use admin dashboard then these two route will not needed.
  app.use("/api/admin/", adminRoutes);
  app.use("/api/orders/", orderRoutes);
  app.use("/api/blog",blogRouters)
  app.use("/api/seller",sellerRouters)

  // Use express's default error handling middleware
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(400).json({ message: err.message });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}


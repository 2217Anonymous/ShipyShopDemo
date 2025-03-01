const express = require("express");
const router = express.Router();
const { isAuth } = require("../config/auth");

const {
  getAllOrders,
  getOrderById,
  getOrderCustomer,
  updateOrder,
  deleteOrder,
  bestSellerProductChart,
  getDashboardOrders,
  getDashboardRecentOrder,
  getDashboardCount,
  getDashboardAmount,
  pickupDateUpdation,
  returnApproveandReject,
  returnPickupstatusUpdation,
  refundOrders,
  refundStatusUpdation,
  AdminreturnPickupDateUpdation,
  adminreturnPickstatus
} = require("../controller/orderController");
const { orderView, singleOrderView, orderStatusUpdation, pickupdateUpdate, ReturnApproveandReject, ReturnPickupstatusUpdation,RefundStatusUpdation, validatotionResult } = require("../config/express-validator");

//get all orders
router.post("/orderView",isAuth, orderView, validatotionResult, getAllOrders);

// get dashboard orders data
router.get("/dashboard",isAuth, getDashboardOrders);

// dashboard recent-order
router.get("/dashboard-recent-order",isAuth, getDashboardRecentOrder);

// dashboard order count
router.get("/dashboard-count",isAuth, getDashboardCount);

// dashboard order amount
router.get("/dashboard-amount",isAuth, getDashboardAmount);

// chart data for product
router.get("/best-seller/chart",isAuth, bestSellerProductChart);

//get all order by a user
router.get("/customer/:id",isAuth, getOrderCustomer);

//get a order by id
router.post("/orderSingleView",isAuth, singleOrderView, validatotionResult, getOrderById);

//update a order
router.post("/orderStatusUpdation",isAuth, orderStatusUpdation, validatotionResult, updateOrder);
router.post("/pickupDateUpdation",isAuth, pickupdateUpdate, validatotionResult, pickupDateUpdation);
router.post("/returnApproveandReject",isAuth, ReturnApproveandReject, validatotionResult, returnApproveandReject);
router.post("/returnPickupstatusUpdation",isAuth, ReturnPickupstatusUpdation, validatotionResult, returnPickupstatusUpdation);
router.post("/refundStatusUpdation",isAuth, RefundStatusUpdation, validatotionResult, refundStatusUpdation);
router.post("/returnPickupDateUpdation",isAuth, pickupdateUpdate, validatotionResult,AdminreturnPickupDateUpdation);
router.post("/adminreturnPickstatus", isAuth, ReturnPickupstatusUpdation, validatotionResult, adminreturnPickstatus);




router.post("/refundOrders",isAuth, refundOrders);




//delete a order
router.delete("/:id",isAuth, deleteOrder);

module.exports = router;

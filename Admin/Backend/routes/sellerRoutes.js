const express = require("express");
const router = express.Router();

const {
    SellerView,
    sellerStatusUpdate,
    singleSellerView,
    sellerProfileDetails,
    profileApproveReject,
    SellerRequestView,
    requestApproveReject,
    sellerPayRequestView,
    singlePayRequestView,
    payRequestApproveReject,
    sellerProducts,
    sellerProductApproveReject,
    payOrderDetails
} = require("../controller/sellerController");
const { isAuth } = require("../config/auth");


//seller details
router.post("/sellerView",isAuth, SellerView);
router.post("/singleSellerView",isAuth, singleSellerView);
router.post("/sellerStatusUpdate",isAuth, sellerStatusUpdate);
router.post("/sellerProfileDetails",isAuth, sellerProfileDetails);
router.post("/profileApproveReject",isAuth, profileApproveReject);

router.post("/SellerRequestView",isAuth, SellerRequestView);
router.post("/requestApproveReject",isAuth, requestApproveReject);

router.post("/payRequestView",isAuth, sellerPayRequestView)
router.post("/singlePayRequestView",isAuth, singlePayRequestView)
router.post("/payRequestApproveReject",isAuth, payRequestApproveReject);
router.post("/payOrderDetails",isAuth, payOrderDetails);


router.post("/sellerProducts",isAuth, sellerProducts);
router.post("/productApproveReject",isAuth, sellerProductApproveReject);


module.exports = router;
const { check, validationResult }   = require('express-validator')
const { sendJson }                  = require("../guider/sendResponse");


const validatotionResult = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const error = result.array()[0].msg;
        return sendJson({ status: false, message: error }, res)

    }
    else {
        next();
    }

}
//verifyEmail

const orderView = [
    check('status').trim().not().isEmpty().withMessage('Status is required'),
]

const singleOrderView = [
    check('orderId').trim().not().isEmpty().withMessage('ordr Id is required'),
    check('cartId').trim().not().isEmpty().withMessage('cart Id is required'),

]

const orderStatusUpdation = [
    check('orderId').trim().not().isEmpty().withMessage('order Id is required'),
    check('cartId').trim().not().isEmpty().withMessage('cartId is required'),

]
const pickupdateUpdate = [
    check('pickupDate').trim().not().isEmpty().withMessage('Pickup date is required'),
    check('orderId').trim().not().isEmpty().withMessage('Order Id is required'),
    check('cartId').trim().not().isEmpty().withMessage('Cart Id is required'),
]

const ReturnApproveandReject = [
    check('status').trim().not().isEmpty().withMessage('Approval status Id is required'),
    check('orderId').trim().not().isEmpty().withMessage('Order Id is required'),
    check('cartId').trim().not().isEmpty().withMessage('Cart Id is required'),

]
const ReturnPickupstatusUpdation = [
    check('orderId').trim().not().isEmpty().withMessage('Order Id is required'),
    check('cartId').trim().not().isEmpty().withMessage('Cart Id is required'),
]

const RefundStatusUpdation = [
    check('trasactionId').trim().not().isEmpty().withMessage('Transaction Id is required'),
    check('orderId').trim().not().isEmpty().withMessage('Order Id is required'),
    check('cartId').trim().not().isEmpty().withMessage('Cart Id is required'),

]
module.exports = {
    validatotionResult, orderView, singleOrderView, orderStatusUpdation, pickupdateUpdate, ReturnApproveandReject, ReturnPickupstatusUpdation,RefundStatusUpdation
}
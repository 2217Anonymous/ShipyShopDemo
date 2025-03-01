const { sendJson } = require("../guider/sendResponse");
const Order = require("../models/Order");
var ObjectId = require('mongoose').Types.ObjectId
const { addProductQuantity } = require("../lib/stock-controller/others");
const emailTemplate = require('../models/emalTemplate')
const moment = require('moment');
const { sendemail } = require('../lib/email-sender/sender')

const getAllOrders = async (req, res) => {
  const { customerName, sellerName, status, page, limit, day, startDate, endDate,type } = req.body;
  let returnStatus = req.body.returnStatus ? req.body.returnStatus : 0
  // day count
  let date = new Date();
  const today = date.toString();
  date.setDate(date.getDate() - Number(day));
  const dateTime = date.toString();

  let before_today = new Date(endDate)
  before_today.setHours(23, 59, 59, 999)

  let start_date = new Date(startDate)
  start_date.setHours(0, 0, 0, 0)

  const queryObject = {};

  if (customerName) {
    queryObject.$or = [
      { "user_info.name": { $regex: `${customerName}`, $options: "i" } },
    ];
  }
  if (sellerName) {
    queryObject.$or = [
      { 'cart.insertByName': { $regex: `${sellerName}`, $options: "i" } },
    ];
  }

  if (day) {
    queryObject.createdAt = { $gte: dateTime, $lte: today };
  }

  if (status && status == "Return-Refund" || status == "Return-exchange") {
    queryObject['cart.orderStatus'] = status;
    queryObject['cart.returnStatus'] = returnStatus;


  } else if(status){
    queryObject['cart.orderStatus'] = status;

  }else{
    return sendJson({ status: false, message: 'Status is required' }, res);
  }

  if(type){
    queryObject['cart.insertByRole'] = type;

  }
  if (startDate && endDate) {
    queryObject.createdAt = {
      $gte: start_date,
      $lte: before_today,
    };
  }
  const pages = Number(page) || 1;
  const limits = Number(limit) || 10;
  const skip = (pages - 1) * limits;

  try {
    // total orders count
    const [totalDoc, orders] = await Promise.all([

      await Order.aggregate([{ '$unwind': '$cart' }, { '$match': queryObject }]).exec(),
      await Order.aggregate([{ '$unwind': '$cart' }, { '$match': queryObject }, { '$sort': { updatedAt: -1 } }, { '$skip': skip }, { '$limit': limits }]).exec()
    ])
    // const totalDoc = await Order.countDocuments(queryObject);
    // const orders = await Order.find(queryObject)
    // .select(
    //   "_id invoice paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt"
    // )
    // .sort({ updatedAt: -1 })
    // .skip(skip)
    // .limit(limits);
    const details = {
      orders,
      limits,
      pages,
      totalDoc: totalDoc.length,
      // orderOverview,
    }

    return sendJson({ status: true, message: '', details: details }, res);
  } catch (err) {
    return sendJson({ status: false, message: err.message }, res);
  }
};

const getOrderCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ _id: -1 });

    return sendJson({ status: true, message: '', details: orders }, res)
  } catch (err) {
    return sendJson({ status: false, message: err.message }, res)
  }
};

const getOrderById = async (req, res) => {
  try {
    let id = req.body.orderId
    let cartsId = req.body.cartId
    const order = await Order.findOne({ _id: id, }, { _id: 0 });

    if (order) {
      let product = order.cart.filter(product => product.variantProductId == cartsId)
      let Pro = product.length > 0 ? product : order.cart.filter(product => product._id == cartsId)


      let orderData = {
        product: Pro ? Pro[0] : [],
        otherDetails: order
      }
      return sendJson({ status: true, details: orderData }, res)

    } else {
      return sendJson({ status: false, message: 'No data found' }, res)
    }

  } catch (err) {
    return sendJson({ status: false, message: err.message }, res)
  }
};

const updateOrder = async (req, res) => {
  try {
    const { newStatus, orderId, cartId, reason } = req.body;


    let cartsId = cartId
    const order = await Order.findOne({ _id: orderId, }, { _id: 0 });
    if (order) {
      let products = order.cart.filter(product => product.variantProductId == cartsId)
      let product = order.cart.filter(product => product._id == cartsId)
      if(products.length > 0 || product.length > 0 ){

        let checkStatus = (products.length > 0) ? products[0].orderStatus : product[0].orderStatus
        let where = (products.length > 0) ? { _id: ObjectId(orderId), cart: { '$elemMatch': { variantProductId: (cartsId) } } } : { _id: ObjectId(orderId), cart: { '$elemMatch': { _id: (cartsId) }, } }
        if (newStatus == "Cancel") {
          if (checkStatus != "Delivered" && checkStatus != "Cancel") {

            await Order.updateOne(where, { $set: { 'cart.$.orderStatus': "Cancel", 'cart.$.cancelDate': new Date(), 'cart.$.cancelReason': reason, 'cart.$.cancelledBy': "Admin" } }).then(async (result, err) => {
              if (err) {
                return sendJson({ status: false, message: "Order status updation error" }, res)
              } else {
                let qtyupdation = (products.length > 0) ? products : product
                await addProductQuantity(qtyupdation).catch(async (err) => {
                  return sendMsg({ status: false, message: err.message }, res)
                });
                const today = moment().format("MMM Do YY"); 
                const template = await emailTemplate.findOne({ templateName: "orderUpdation" })
                let content = `Sorry for this, Your Product cancelled by Admin Because of ${reason}. Your order details are shown below for your reference.`
                let proDetails = (products.length > 0) ? products : product
                let payType = proDetails[0].paymentMethod == "COD" ? "Cash on delivery" : "Online payment"

                let templateContent = template.content.replace('###status###', "Cancelled")
                  .replace('###content###', content)
                  .replace('###invoice###', order.invoice)
                  .replace('###deliveryDate###', today)
                  .replace('###address###', order.user_info.address)
                  .replace('###city###', order.user_info.city)
                  .replace('###pincode###', order.user_info.pincode)
                  .replace('###productName###', proDetails[0].slug)
                  .replace('###productQty###', proDetails[0].quantity)
                  .replace('###productPrice###', proDetails[0].prices.price)
                  .replace('###payMethod###', payType)
                  .replace('###status###',"Cancelled")



                let option = {
                  toemail: order.user_info.email,
                  html: templateContent,
                  subject: "Order Cancelled"
                }
                const message = { status: true, message: 'Order Cancelled Successfully!' }
                return sendemail(option, res, message);
              }
            })

          } else {
            let Message = (checkStatus == "Delivered") ? "Order Already delivered" : ""
            Message = (checkStatus == "Cancel") ? "Order already cancelled" : Message
            return sendJson({ status: false, message: Message }, res)
          }
        } else {

          let updateStatus = checkStatus == "Pending" ? "Packed" : checkStatus == "Packed" ? "Shipped" : checkStatus == "Shipped" ? "Delivered" : ""
          if (updateStatus != "") {
            let field = "cart.$." + updateStatus + "Date";
            Order.updateOne(where, { $set: { 'cart.$.orderStatus': updateStatus, [field]: new Date() } }).then(async (result, err) => {
              if (err) {
                return sendJson({ status: false, message: "Order status updation error" }, res)
              } else {
                let finddate = order.createdAt
                dateFrom = moment(finddate).add(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
                split = dateFrom.split(' ')[0];
                const template = await emailTemplate.findOne({ templateName: "orderUpdation" })
                let content = `Your order has been ${updateStatus}. Your order details are shown below for your reference.`
                let proDetails = (products.length > 0) ? products : product
                let payType = proDetails[0].paymentMethod == "COD" ? "Cash on delivery" : "Online payment"

                let templateContent = template.content.replace('###status###', updateStatus)
                  .replace('###content###', content)
                  .replace('###invoice###', order.invoice)
                  .replace('###deliveryDate###', split)
                  .replace('###address###', order.user_info.address)
                  .replace('###city###', order.user_info.city)
                  .replace('###pincode###', order.user_info.pincode)
                  .replace('###productName###', proDetails[0].sku)
                  .replace('###productQty###', proDetails[0].quantity)
                  .replace('###productPrice###', proDetails[0].prices.price)
                  .replace('###payMethod###', payType)
                  .replace('###status###',updateStatus == "Delivered" ? "Deliverd" : "Estimated delivery")



                let option = {
                  toemail: order.user_info.email,
                  html: templateContent,
                  subject: `Order ${updateStatus}`
                }
                const message = { status: true, message: 'Order Updated Successfully!' }
                return sendemail(option, res, message);
              }

            })

          } else {
            return sendJson({ status: false, message: 'Invalid Order Request' }, res)
          }
        }
      }else{
        return sendJson({ status: false, message: 'No data found' }, res)

      }
    } else {
      return sendJson({ status: false, message: 'No data found' }, res)
    }

  } catch (error) {
    return sendJson({ status: false, message: error.message }, res)
  }
}
//pending product pickup date updation
const pickupDateUpdation  = async (req,res) =>{

  try{

    let AdminData  = req.user
    // return true;
    const { pickupDate, orderId, cartId } = req.body;
    const currentDate = new Date()

    let start_date = new Date(pickupDate)
    start_date.setHours(23, 59, 59, 999)

    if(currentDate <= start_date){
      let cartsId = cartId
      const order = await Order.findOne({ _id: orderId, }, { _id: 0 });
      if (order) {
        let products = order.cart.filter(product => product.variantProductId == cartsId)
        let product = order.cart.filter(product => product._id == cartsId)
        if(products.length > 0){
          products = products.filter(product => product.insertByName == AdminData.name && product.insertById == AdminData.AdminId && product.insertByRole == "Admin" )
        } else {
            product = product.filter(product => product.insertByName == AdminData.name && product.insertById == AdminData.AdminId && product.insertByRole == "Admin" )
        }
          if (product.length > 0 ||products.length > 0 ) {
  
            let dataType = (products.length > 0) ? products[0] :product[0]
            if(dataType.orderStatus == "Pending"){
              let where = (products.length > 0) ? { _id: new ObjectId(orderId), cart: { '$elemMatch': { variantProductId: (cartsId) } } } : { _id: new ObjectId(orderId), cart: { '$elemMatch': { _id: (cartsId) }, } }

              let updateStatus ="PickupUpdation"
              if (updateStatus != "") {
                let field = "cart.$." + updateStatus + "Date";
                Order.updateOne(where, { $set: { 'cart.$.pickupDate': pickupDate, [field]: new Date() } }).then(async (result, err) => {
                  if (err) {
                    return sendJson({ status: false, message: "Pickup date updation error" }, res)
                  } else {
                    const message = { status: true, message: 'Pickup date Updated Successfully!' }
                    return sendJson(message, res)
                  }
                })
              } else {
                return sendJson({ status: false, message: 'Invalid Order Request' }, res)
              }
            }else{
              return sendJson({ status: false, message: 'you can only update the date for pending products' }, res)
            }
          }else{
            return sendJson({ status: false, message: 'No data found' }, res)
          }

      } else {
        return sendJson({ status: false, message: 'No data found' }, res)
      }
    }else{
      return sendJson({ status: false, message: 'Kindly update valid date' }, res)
    }
  } catch (error) {
    return sendJson({ status: false, message: error.message }, res)
  }
}

//if approve pick update also update
const returnApproveandReject = async (req,res) =>{
  try{
    let AdminData  = req.user

    const { status, orderId, cartId, reason } = req.body;
    let returnpickupDate = req.body.returnpickupDate ? req.body.returnpickupDate : ""
    let cartsId = cartId
    let ApprovalStatus = (status == 1) ? "Approved" : "Rejected"
    const currentDate = new Date()
    let start_date = new Date(returnpickupDate)
    start_date.setHours(23, 59, 59, 999)

    if(status == 1 && (currentDate >= start_date || returnpickupDate == "" )){
      let Msg =( currentDate >= start_date) ?  'Kindly update valid date' : ""
          Msg =( returnpickupDate == "") ?  'Return pickup date required' : Msg
      return sendJson({ status: false, message: Msg }, res)
    }
    if(status == 2 && (reason == "" || reason == undefined)){
      return sendJson({ status: false, message: 'Reject reason is required' }, res)
    }

    const order = await Order.findOne({ _id: orderId, }, { _id: 0 });
    if (order) {
      let products = order.cart.filter(product => product.variantProductId == cartsId)
      let product = order.cart.filter(product => product._id == cartsId)
      if(status == 1){
        if(products.length > 0){
          products = products.filter(product => product.insertByName == AdminData.name && product.insertById == AdminData.AdminId && product.insertByRole == "Admin" )
        } else {
            product = product.filter(product => product.insertByName == AdminData.name && product.insertById == AdminData.AdminId && product.insertByRole == "Admin" )
        }
      }
      if(products.length > 0 || product.length > 0 ){
        let checkStatus = (products.length > 0) ? products[0] : product[0]
        let where = (products.length > 0) ? { _id: ObjectId(orderId), cart: { '$elemMatch': { variantProductId: (cartsId) } } } : { _id: ObjectId(orderId), cart: { '$elemMatch': { _id: (cartsId) }, } }
        
          if ((checkStatus.orderStatus == "Return-Refund" ||  checkStatus.orderStatus == "Return-exchange" ) && checkStatus.returnStatus == 0 ) {
            let obj = (status == 1) ? { $set: {'cart.$.returnStatus': 1 , 'cart.$.approvalDate': new Date(),'cart.$.returnPickupDate': returnpickupDate,'cart.$.userreturnPickstatus': 0 } } : { $set: {'cart.$.returnStatus': 2 , 'cart.$.approvalDate': new Date(), 'cart.$.rejectReason': reason } }
            await Order.updateOne(where, obj).then(async (result, err) => {
              if (err) {
                return sendJson({ status: false, message: "Order status updation error" }, res)
              } else {
                const today = moment().format("MMM Do YY"); 
                const template = await emailTemplate.findOne({ templateName: "orderUpdation" })
                let content = `Your return request ${ApprovalStatus} . Your order details are shown below for your reference.`
                let proDetails = (products.length > 0) ? products : product
                let payType = proDetails[0].paymentMethod == "COD" ? "Cash on delivery" : "Online payment"
  
                let templateContent = template.content.replace('###status###', `Return ${ApprovalStatus}`)
                  .replace('###content###', content)
                  .replace('###invoice###', order.invoice)
                  .replace('###deliveryDate###',(status == 1) ? returnpickupDate : today)
                  .replace('###address###', order.user_info.address)
                  .replace('###city###', order.user_info.city)
                  .replace('###pincode###', order.user_info.pincode)
                  .replace('###productName###', proDetails[0].slug)
                  .replace('###productQty###', proDetails[0].quantity)
                  .replace('###productPrice###', proDetails[0].prices.price)
                  .replace('###payMethod###', payType)
                  .replace('###status###',(status == 1) ? "Pickup Date" : "Rejected")
                let option = {
                  toemail: order.user_info.email,
                  html: templateContent,
                  subject: `Order return ${ApprovalStatus}`
                }
                const message = { status: true, message: `Order return ${ApprovalStatus}` }
                return sendemail(option, res, message);
              }
            })
  
          } else {
            let Msg = (checkStatus.returnStatus != 0) ? "Status already updated" :  "Invalid order for this action"
            return sendJson({ status: false, message: Msg }, res)
          }
      }else{
        return sendJson({ status: false, message: 'No data found' }, res)

      }

    } else {
      return sendJson({ status: false, message: 'No data found' }, res)
    }

  } catch (error) {
    return sendJson({ status: false, message: error.message }, res)
  }
}
//user return pickup status
const returnPickupstatusUpdation = async (req,res) =>{
  try{

    const {  orderId, cartId } = req.body;
    let cartsId = cartId

    const order = await Order.findOne({ _id: orderId, }, { _id: 0 });
    if (order) {
      let products = order.cart.filter(product => product.variantProductId == cartsId)
      let product = order.cart.filter(product => product._id == cartsId)

      if(products.length > 0 || product.length > 0 ){
        let checkStatus = (products.length > 0) ? products[0] : product[0]
        let where = (products.length > 0) ? { _id: ObjectId(orderId), cart: { '$elemMatch': { variantProductId: (cartsId) } } } : { _id: ObjectId(orderId), cart: { '$elemMatch': { _id: (cartsId) }, } }

          if ((checkStatus.orderStatus == "Return-Refund" ||  checkStatus.orderStatus == "Return-exchange" ) && checkStatus.returnStatus == 1 ) {

            let obj = (checkStatus.orderStatus == "Return-Refund") ?  { $set: {'cart.$.returnPickupCompleteDate': new Date(),'cart.$.userreturnPickstatus': 1 ,'cart.$.refundStatus': 0} } :  { $set: {'cart.$.returnPickupCompleteDate': new Date(),'cart.$.userreturnPickstatus': 1 } }
            await Order.updateOne(where, obj).then(async (result, err) => {
              if (err) {
                return sendJson({ status: false, message: "Order status updation error" }, res)
              } else {
                let qtyupdation = (products.length > 0) ? products : product
                await addProductQuantity(qtyupdation).catch(async (err) => {
                  return sendJson({ status: false, message: err.message }, res)
                });
                const today = moment().format("MMM Do YY"); 
                const template = await emailTemplate.findOne({ templateName: "orderUpdation" })
                let content = (checkStatus.orderStatus == "Return-Refund") ? `Your return pickup completed, Your order amount refund within 5 -7 working days. Your order details are shown below for your reference.` : "Your return pickup completed. Your order details are shown below for your reference."
                let proDetails = (products.length > 0) ? products : product
                let payType = proDetails[0].paymentMethod == "COD" ? "Cash on delivery" : "Online payment"
  
                let templateContent = template.content.replace('###status###', `Return Pickup completed`)
                  .replace('###content###', content)
                  .replace('###invoice###', order.invoice)
                  .replace('###deliveryDate###', today)
                  .replace('###address###', order.user_info.address)
                  .replace('###city###', order.user_info.city)
                  .replace('###pincode###', order.user_info.pincode)
                  .replace('###productName###', proDetails[0].slug)
                  .replace('###productQty###', proDetails[0].quantity)
                  .replace('###productPrice###', proDetails[0].prices.price)
                  .replace('###payMethod###', payType)
                  .replace('###status###',"Return Pickup complete")
  
  
  
                let option = {
                  toemail: order.user_info.email,
                  html: templateContent,
                  subject: `Order return pickup completed`
                }
                const message = { status: true, message: `Order return pickup completed` }
                return sendemail(option, res, message);
              }
            })
  
          } else {
            let Msg = (checkStatus.returnStatus != 1) ? "Order return not be approved" :  "Invalid order for this action"
            return sendJson({ status: false, message: Msg }, res)
          }
      }else{
        return sendJson({ status: false, message: 'No data found' }, res)

      }

    } else {
      return sendJson({ status: false, message: 'No data found' }, res)
    }

  } catch (error) {
    return sendJson({ status: false, message: error.message }, res)
  }
}

//admin return exchange pickup confirmation date updation

const AdminreturnPickupDateUpdation  = async (req,res) =>{

  try{

    let AdminData  = req.user
    const { pickupDate, orderId, cartId } = req.body;
    const currentDate = new Date()

    let start_date = new Date(pickupDate)
    start_date.setHours(23, 59, 59, 999)

    if(currentDate <= start_date){
      let cartsId = cartId
      const order = await Order.findOne({ _id: orderId, }, { _id: 0 });
      if (order) {
        let products = order.cart.filter(product => product.variantProductId == cartsId)
        let product = order.cart.filter(product => product._id == cartsId)
        if(products.length > 0){
          products = products.filter(product => product.insertByName == AdminData.name && product.insertById == AdminData.AdminId && product.insertByRole == "Admin" )
        } else {
            product = product.filter(product => product.insertByName == AdminData.name && product.insertById == AdminData.AdminId && product.insertByRole == "Admin" )
        }
          if (product.length > 0 ||products.length > 0 ) {
  
            let dataType = (products.length > 0) ? products[0] :product[0]
            if(dataType.orderStatus == "Return-exchange" && dataType.returnStatus == 1){
              let where = (products.length > 0) ? { _id: new ObjectId(orderId), cart: { '$elemMatch': { variantProductId: (cartsId) } } } : { _id: new ObjectId(orderId), cart: { '$elemMatch': { _id: (cartsId) }, } }

              let updateStatus ="returnPickupUpdation"
              if (updateStatus != "") {
                let field = "cart.$." + updateStatus + "Date";
                Order.updateOne(where, { $set: { 'cart.$.AdminreturnpickupDate': pickupDate, [field]: new Date(), 'cart.$.AdminreturnPickstatus': 0, } }).then(async (result, err) => {
                  if (err) {
                    return sendJson({ status: false, message: "Return product Pickup date updation error" }, res)
                  } else {
                    const message = { status: true, message: 'Return product Pickup date Updated Successfully!' }
                    return sendJson(message, res)
                  }
                })
              } else {
                return sendJson({ status: false, message: 'Invalid Order Request' }, res)
              }
            }else{
              let Msg = (dataType.returnStatus != 1) ? "Return-exchange still not approved" : ""
                  Msg = (dataType.returnStatus == 1) ? 'you can only update the date for Return-exchange products' :Msg

              return sendJson({ status: false, message: Msg }, res)
            }
          }else{
            return sendJson({ status: false, message: 'No data found' }, res)
          }

      } else {
        return sendJson({ status: false, message: 'No data found' }, res)
      }
    }else{
      return sendJson({ status: false, message: 'Kindly update valid date' }, res)
    }
  } catch (error) {
    return sendJson({ status: false, message: error.message }, res)
  }
}
//admin return exchange pickup confirmation status updation

const adminreturnPickstatus = async (req,res) =>{
  try{

    const {  orderId, cartId } = req.body;
    let cartsId = cartId

    const order = await Order.findOne({ _id: orderId, }, { _id: 0 });
    if (order) {
      let products = order.cart.filter(product => product.variantProductId == cartsId)
      let product = order.cart.filter(product => product._id == cartsId)

      if(products.length > 0 || product.length > 0 ){
        let checkStatus = (products.length > 0) ? products[0] : product[0]
        let where = (products.length > 0) ? { _id: ObjectId(orderId), cart: { '$elemMatch': { variantProductId: (cartsId) } } } : { _id: ObjectId(orderId), cart: { '$elemMatch': { _id: (cartsId) }, } }


          if ((checkStatus.orderStatus == "Return-Refund" ||  checkStatus.orderStatus == "Return-exchange" ) && checkStatus.returnStatus == 1 ) {

            let obj = { $set: {'cart.$.adminReturnPickupCompleteDate': new Date(),'cart.$.AdminreturnPickstatus': 1 } }
            await Order.updateOne(where, obj).then(async (result, err) => {
              if (err) {
                return sendJson({ status: false, message: "Order status updation error" }, res)
              } else {
                return sendJson({ status: true, message: `Order return pickup completed` }, res)
              }
            })
  
          } else {
            let Msg = (checkStatus.returnStatus != 1) ? "Order return not be approved" :  "Invalid order for this action"
            return sendJson({ status: false, message: Msg }, res)
          }
      }else{
        return sendJson({ status: false, message: 'No data found' }, res)

      }

    } else {
      return sendJson({ status: false, message: 'No data found' }, res)
    }

  } catch (error) {
    return sendJson({ status: false, message: error.message }, res)
  }
}
const refundOrders = async (req,res) =>{

  const { customerName, sellerName, page, limit, day, startDate, endDate,type,refundStatus } = req.body;
  // day count
  let date = new Date();
  const today = date.toString();
  date.setDate(date.getDate() - Number(day));
  const dateTime = date.toString();

  let before_today = new Date(endDate)
  before_today.setHours(23, 59, 59, 999)

  let start_date = new Date(startDate)
  start_date.setHours(0, 0, 0, 0)

  const queryObject = {};

  queryObject['cart.orderStatus'] =  "Return-Refund"
  queryObject['cart.returnStatus'] = 1
  queryObject['cart.userreturnPickstatus'] = 1
  queryObject['cart.refundStatus'] = refundStatus ? refundStatus : 0

  if (customerName) {
    queryObject.$or = [
      { "user_info.name": { $regex: `${customerName}`, $options: "i" } },
    ];
  }
  if (sellerName) {
    queryObject.$or = [
      { 'cart.insertByName': { $regex: `${sellerName}`, $options: "i" } },
    ];
  }

  if (day) {
    queryObject.createdAt = { $gte: dateTime, $lte: today };
  }

  if(type){
    queryObject['cart.insertByRole'] = type;

  }
  if (startDate && endDate) {
    queryObject.createdAt = {
      $gte: start_date,
      $lte: before_today,
    };
  }
  const pages = Number(page) || 1;
  const limits = Number(limit) || 10;
  const skip = (pages - 1) * limits;

  try {
    // total orders count
    const [totalDoc, orders] = await Promise.all([

      await Order.aggregate([{ '$unwind': '$cart' }, { '$match': queryObject }]).exec(),
      await Order.aggregate([{ '$unwind': '$cart' }, { '$match': queryObject }, { '$sort': { updatedAt: -1 } }, { '$skip': skip }, { '$limit': limits }]).exec()
    ])
    // const totalDoc = await Order.countDocuments(queryObject);
    // const orders = await Order.find(queryObject)
    // .select(
    //   "_id invoice paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt"
    // )
    // .sort({ updatedAt: -1 })
    // .skip(skip)
    // .limit(limits);
    const details = {
      orders,
      limits,
      pages,
      totalDoc: totalDoc.length,
      // orderOverview,
    }

    return sendJson({ status: true, message: '', details: details }, res);
  } catch (err) {
    return sendJson({ status: false, message: err.message }, res);
  }
}

const refundStatusUpdation = async (req,res) =>{
  try{

    const {  orderId, cartId ,trasactionId} = req.body;
    let cartsId = cartId

    const order = await Order.findOne({ _id: orderId, }, { _id: 0 });
    if (order) {
      let products = order.cart.filter(product => product.variantProductId == cartsId)
      let product = order.cart.filter(product => product._id == cartsId)

      if(products.length > 0 || product.length > 0 ){
        let checkStatus = (products.length > 0) ? products[0] : product[0]
        let where = (products.length > 0) ? { _id: ObjectId(orderId), cart: { '$elemMatch': { variantProductId: (cartsId) } } } : { _id: ObjectId(orderId), cart: { '$elemMatch': { _id: (cartsId) }, } }
          if (checkStatus.orderStatus == "Return-Refund"  && checkStatus.returnStatus == 1&& checkStatus.refundStatus == 0  ) {

            await Order.updateOne(where, { $set: {'cart.$.refundStatus': 1,'cart.$.refundTxnId': trasactionId, 'cart.$.refundCompleteDate': new Date()} } ).then(async (result, err) => {
              if (err) {
                return sendJson({ status: false, message: "Order status updation error" }, res)
              } else {
                let qtyupdation = (products.length > 0) ? products : product
                await addProductQuantity(qtyupdation).catch(async (err) => {
                  return sendJson({ status: false, message: err.message }, res)
                });
                const today = moment().format("MMM Do YY"); 
                const template = await emailTemplate.findOne({ templateName: "orderUpdation" })
                let content = `Your return Order refund process completed,Kindly check your refund amount using this <b>Transaction Id : ${trasactionId} <b>. Your order details are shown below for your reference.`
                let proDetails = (products.length > 0) ? products : product
                let payType = proDetails[0].paymentMethod == "COD" ? "Cash on delivery" : "Online payment"
  
                let templateContent = template.content.replace('###status###', `Return Refund Completed`)
                  .replace('###content###', content)
                  .replace('###invoice###', order.invoice)
                  .replace('###deliveryDate###', today)
                  .replace('###address###', order.user_info.address)
                  .replace('###city###', order.user_info.city)
                  .replace('###pincode###', order.user_info.pincode)
                  .replace('###productName###', proDetails[0].slug)
                  .replace('###productQty###', proDetails[0].quantity)
                  .replace('###productPrice###', proDetails[0].prices.price)
                  .replace('###payMethod###', payType)
                  .replace('###status###',"Return refund complete")
  
  
  
                let option = {
                  toemail: order.user_info.email,
                  html: templateContent,
                  subject: `Order return refund completed`
                }
                const message = { status: true, message: `Order return refund completed` }
                return sendemail(option, res, message);
              }
            })
  
          } else {
            let Msg =( checkStatus.orderStatus != "Return-Refund" ) ? "This not refund order" : ""
                Msg =( checkStatus.returnStatus != 1)               ? "Refund still not approved" : Msg
                Msg =( checkStatus.refundStatus == 1  )             ? "Already refund completed" : Msg
            return sendJson({ status: false, message: Msg }, res)
          }
      }else{
        return sendJson({ status: false, message: 'No data found' }, res)

      }

    } else {
      return sendJson({ status: false, message: 'No data found' }, res)
    }

  } catch (err) {
    return sendJson({ status: false, message: err.message }, res);
  }
}
const deleteOrder = async (req, res) => {
  // try {
  //   await Order.deleteOne({ _id: req.params.id }, (err) => {
  //     if (err) {
  //       return sendJson({ status: false, message: err.message }, res)

  //     } else {
  //       return sendJson({ status: true, message: 'Order Deleted Successfully!' }, res)
  //     }
  //   });
  // } catch (err) {
  //   return sendJson({ status: false, message: err.message }, res)

  // }

};

// get dashboard recent order
const getDashboardRecentOrder = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const queryObject = {};

    queryObject.$or = [
      { 'cart.orderStatus': { $regex: `Processing`, $options: "i" } },
      { 'cart.orderStatus': { $regex: `Pending`, $options: "i" } },
      { 'cart.orderStatus': { $regex: `Packed`, $options: "i" } },
      { 'cart.orderStatus': { $regex: `Shipped`, $options: "i" } },
      { 'cart.orderStatus': { $regex: `Delivered`, $options: "i" } },

    ];

    const [totalDoc, orders] = await Promise.all([

      await Order.aggregate([{ '$unwind': '$cart' }, { '$match': queryObject }]).exec(),
      await Order.aggregate([{ '$unwind': '$cart' }, { '$match': queryObject }, { '$sort': { updatedAt: -1 } }, { '$skip': skip }, { '$limit': limits }]).exec()
    ])

    const details = {
      orders: orders,
      page: page,
      limit: limit,
      totalOrder: totalDoc,
    }
    return sendJson({ status: true, message: '', details: details },res)

  } catch (err) {
    return sendJson({ status: false, message: err.message }, res)
  }
};

// get dashboard count
const getDashboardCount = async (req, res) => {
  try {


    const [totalDoc, totalPendingOrder, totalProcessingOrder, totalDeliveredOrder] = await Promise.all([
      await Order.countDocuments().exec(),

      // total padding order count
      await Order.aggregate([
        {
          $match: {
            status: "Pending",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
            count: {
              $sum: 1,
            },
          },
        },
      ]).exec(),


      // total processing order count

      await Order.aggregate([
        {
          $match: {
            status: "Processing",
          },
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: 1,
            },
          },
        },
      ]).exec(),

      // total delivered order count
      await Order.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: 1,
            },
          },
        },
      ]).exec()

    ]).catch(async (err) => {
      return sendJson({ status: false, message: err.message }, res)
    })
    const details = {
      totalOrder: totalDoc,
      totalPendingOrder: totalPendingOrder[0] || 0,
      totalProcessingOrder: totalProcessingOrder[0]?.count || 0,
      totalDeliveredOrder: totalDeliveredOrder[0]?.count || 0,
    }

    return sendJson({ status: true, message: '', details: details }, res)
  } catch (err) {
    return sendJson({ status: false, message: err.message }, res)
  }
};

const getDashboardAmount = async (req, res) => {
  let week = new Date();
  week.setDate(week.getDate() - 10);
  
  var start = new Date();
  start.setHours(0,0,0,0);

  var end = new Date();
  end.setHours(23,59,59,999);

  var startyesterday = new Date();
  startyesterday.setDate(startyesterday.getDate()-1);
  startyesterday.setHours(0,0,0,0);

  var endyesterday = new Date();
  endyesterday.setDate(endyesterday.getDate()-1);
  endyesterday.setHours(23,59,59,999);

  try {
    // total order amount

    const [totalAmount, thisMonthlyOrderAmount, orderFilteringData,todayOrder,yesterdayOrder] = await Promise.all([
      await Order.aggregate([
        { '$unwind': '$cart' },
        { '$match' : {'cart.orderStatus' : "Delivered"}},
        {
          $group: {
            _id: null,
            tAmount: {
              $sum: "$total",
            },
          },
        },
      ]).exec(),
      await Order.aggregate([
        { '$unwind': '$cart' },
        {
          $match: {
            $or: [{'cart.orderStatus' : "Delivered"}],
            $expr: {
              $eq: [{ $month: "$updatedAt" }, { $month: new Date() }],
            },
          },
        },
        {
          $group: {
            _id: {
              month: {
                $month: "$updatedAt",
              },
            },
            total: {
              $sum: "$total",
            },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $limit: 1,
        },
      ]).exec(),
      // order list last 10 days
      await Order.aggregate([
        { '$unwind': '$cart' },
        { '$match': {$and: [{'cart.orderStatus' : "Delivered"},
                            {updatedAt: { $gte: week }}
                          ]} 
        },
        { '$sort' : {updatedAt: -1 }},
        { '$limit': 8},
        { '$project' : {
           paymentMethod: 1,
           paymentDetails: 1,
           total: 1,
           createdAt: 1,
           updatedAt: 1,
        }}
      ]).exec(),

//today orders amount

      await Order.aggregate([
        
        {$facet: {"basedonPayment": [
          { '$unwind': '$cart' },
          { '$match': {$and: [{'cart.orderStatus' : "Delivered"},
                              {createdAt: {$gte: start, $lt: end}}
                            ]} 
          },

          { $group: {_id: "$paymentMethod",tAmount: { $sum: "$total" }}},
          { $group: { _id: 0, items:{ $push:  {paymentMethod:"$_id",total:"$tAmount"}}} },

        ],
        "totalAmt": [
          { '$unwind': '$cart' },
          { '$match': {$and: [{'cart.orderStatus' : "Delivered"},
                              {createdAt: {$gte: start, $lt: end}}
                              ]} 
          },

        { $group: {_id: null,totalAmount: { $sum: "$total" }}},
      ]}},

      ]).exec(),
//yesterday order
      await Order.aggregate([
        {$facet: {"basedonPayment": [
          { '$unwind': '$cart' },
          { '$match': {$and: [{'cart.orderStatus' : "Delivered"},
                              {createdAt: {$gte: startyesterday, $lt: endyesterday}}
                            ]} 
          },
          { $group: {_id: "$paymentMethod",tAmount: { $sum: "$total" }}},
          { $group: { _id: 0, items:{ $push:  {paymentMethod:"$_id",total:"$tAmount"}}} },

        ],
        "totalAmt": [
          { '$unwind': '$cart' },
          { '$match': {$and: [{'cart.orderStatus' : "Delivered"},
                              {createdAt: {$gte: startyesterday, $lt: endyesterday}}
                            ]} 
          },
          { $group: {_id: null,totalAmount: { $sum: "$total" }}},
      ]}},

      ]).exec(),
    ])
    const details = {
      totalAmount:
        (totalAmount.length === 0)
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      thisMonthlyOrderAmount: (thisMonthlyOrderAmount.length === 0) ? 0 : thisMonthlyOrderAmount[0]?.total,
      ordersData      : orderFilteringData,
      todayOrder      : todayOrder[0]?.basedonPayment[0].items,
      todayOrderTotal : todayOrder[0]?.totalAmt[0].totalAmount,
      yesterdayOrder  : yesterdayOrder[0]?.basedonPayment[0].items,
      yesterdayOrderTotal :  yesterdayOrder[0]?.totalAmt[0].totalAmount
    }

    return sendJson({ status: true, message: '', details: details }, res)
  } catch (err) {
    return sendJson({ status: false, message: err.message }, res)
  }
};

const bestSellerProductChart = async (req, res) => {
  try {
    const [totalDoc, bestSellingProduct] = await Promise.all([
      await Order.countDocuments({}).exec(),
      await Order.aggregate([{ $unwind: "$cart" }, { $group: { _id: "$cart.title", count: { $sum: "$cart.quantity" } } },
      { $sort: { count: -1 } }, { $limit: 4 }])
    ])
    const details = {
      totalDoc,
      bestSellingProduct
    }

    return sendJson({ status: true, message: '', details: details }, res)

  } catch (err) {
    return sendJson({ status: false, message: err.message }, res)
  }
};

const getDashboardOrders = async (req, res) => {
  const { page, limit } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  let week = new Date();
  week.setDate(week.getDate() - 10);

  const start = new Date().toDateString();

  // (startDate = '12:00'),
  //   (endDate = '23:59'),

  try {

    const [totalDoc, orders, totalAmount, todayOrder, totalAmountOfThisMonth, totalPendingOrder, totalProcessingOrder, totalDeliveredOrder, weeklySaleReport] = await Promise.all([
      await Order.countDocuments({}).exec(),

      // query for orders
      await Order.find({})
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limits).exec(),

      await Order.aggregate([
        {
          $group: {
            _id: null,
            tAmount: {
              $sum: "$total",
            },
          },
        },
      ]).exec(),

      // total order amount
      await Order.find({ createdAt: { $gte: start } }).exec(),

      // this month order amount
      await Order.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            total: {
              $sum: "$total",
            },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $limit: 1,
        },
      ]).exec(),
      await Order.aggregate([
        {
          $match: {
            status: "Pending",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
            count: {
              $sum: 1,
            },
          },
        },
      ]).exec(),

      // total delivered order count
      await Order.aggregate([
        {
          $match: {
            status: "Processing",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
            count: {
              $sum: 1,
            },
          },
        },
      ]).exec(),

      await Order.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
            count: {
              $sum: 1,
            },
          },
        },
      ]).exec(),

      //weekly sale report
      // filter order data
      await Order.find({
        $or: [{ status: { $regex: `Delivered`, $options: "i" } }],
        createdAt: {
          $gte: week,
        },
      }).exec()

    ]).catch(async (err) => {
      sendJson({ status: false, message: err.message }, res)
    })

    const details = {
      totalOrder: totalDoc,
      totalAmount: totalAmount.length === 0 ? 0 : parseFloat(totalAmount[0].tAmount).toFixed(2),
      todayOrder: todayOrder,
      totalAmountOfThisMonth: totalAmountOfThisMonth.length === 0 ? 0 : parseFloat(totalAmountOfThisMonth[0].total).toFixed(2),
      totalPendingOrder: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0],
      totalProcessingOrder: totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      totalDeliveredOrder: totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      orders,
      weeklySaleReport
    }

    return sendJson({ status: true, message: '', details: details }, res)

  } catch (err) {

    return sendJson({ status: false, message: err.message }, res)

  }
};

module.exports = {
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
};

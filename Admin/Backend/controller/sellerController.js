const sendResponse  = require("../guider/sendResponse");
const Seller        = require('../models/Seller')
const sellerRequest = require('../models/sellerRequests')
const payRequest    = require('../models/paymentRequest')
const Orders        = require('../models/Order')
const Products      = require('../models/Product')




const SellerView = async (req, res) => {
    try{
        let data         = req.body
        let searchText  = data.searchText ? data.searchText : ""
        let page        = data.page ? data.page : 1
        let limit       = data.limit ? data.limit : 0
  
      let queryObject = {};
  
      if (searchText.length > 0) {
        queryObject.$or = [
          { "name": { $regex: `${searchText}`, $options: "i" } },
          { "phone": {$eq : searchText.trim()} },
          { "email":{$eq :  (searchText.trim())} } 
        ]
      }
  
      const pages = +(page);
      const limits = +(limit);
      const skip = (pages - 1) * limits;
  
      const [sellers, count] = await Promise.all([
        await Seller.find(queryObject).sort({ createdAt: -1 }).skip(skip).limit(limits).exec(),
        await Seller.countDocuments(queryObject).exec()
      ])
      let arr = []
      for (let i = 0; i < sellers.length; i++) {
      let object = {
        seller_id         : sellers[i].seller_id,
        name              : sellers[i].name,
        email             : sellers[i].email,
        phoneno           : sellers[i].phone,
        GSTINnumber       : sellers[i].GSTINnumber,
        createdAt         : sellers[i].createdAt,
        updatedAt         : sellers[i].updatedAt,
      }
        arr.push(object)
      }

        let returnValue = { status: true, message: "", details: arr, count: count };
        return sendResponse.sendJson(returnValue, res);

    }catch{

        let returnValue = { status: false, message: "Some error  occured",  };
        return sendResponse.sendJson(returnValue, res);
    }
};


const singleSellerView = async (req, res) => {
  try{
      let data         = req.body
      let id           = data.id ? data.id : ""

      let seller = await Seller.findOne({seller_id : id})

      let returnValue = { status: true, details: seller };
      return sendResponse.sendJson(returnValue, res);

  }catch{

      let returnValue = { status: false, message: "Some error  occured",  };
      return sendResponse.sendJson(returnValue, res);
  }
};

const sellerStatusUpdate = async (req,res ) =>{
  try{
    let data         = req.body
    let updateStatus = data.status 
    let id           = data.id ? data.id : ""

    let seller = await Seller.findOne({seller_id : id},{ _id:0, status : 1})
    if(seller && seller.status !=  'Inactive' && seller.status != updateStatus && updateStatus != "Inactive"){
      await Seller.updateOne({seller_id : id},{status : updateStatus}).then(async function(result,err) {
        if (!err && result.acknowledged == true && result.modifiedCount >= 1) {
          let returnValue = { status: true, message: "Status successfully updated",  }
          return sendResponse.sendJson(returnValue, res);
        }else{
          let returnValue = { status: false, message: "Status updation error" };
          return sendResponse.sendJson(returnValue, res);
        }
      })
    }else{ 
      let Msg = (seller.status ==  'Inactive') ? "Account status is inactive": ""
          Msg = (seller.status == updateStatus) ? "Already status updated": Msg
          Msg = (updateStatus == "Inactive") ? "Not permited to inactive seller account": Msg
      let returnValue = { status: false, message: Msg};
      return sendResponse.sendJson(returnValue, res);
    }

  }catch(err){
    let returnValue = { status: false, message: "Some error  occured",  };
    return sendResponse.sendJson(returnValue, res);
  }
}

const sellerProfileDetails = async (req,res) =>{
  try{
    let dataStatus         = req.body.status ? req.body.status : 0
    let searchText         = req.body.searchText ? req.body.searchText : ""
    let page               = req.body.page ? req.body.page : 1
    let limit              = req.body.limit ? req.body.limit : 0
    let queryObject = {};
  
    if (searchText.length > 0) {
      queryObject.$or = [
        { "name": { $regex: `${searchText}`, $options: "i" } },
        { "phone": {$eq : searchText.trim()} },
        { "email":{$eq :  (searchText.trim())} } 
      ]
    }

      if(dataStatus == 0){
        var statusFilter =  { $and : [
                                    { $or: [  { 'addressDetails.status'   : 0 }, 
                                    { 'bussinessDetails.status' : 0 }, 
                                    { 'bankDetails.status'      : 0 },
                                    { 'signature.status'        : 0 }  
                                    ] },

        ]}
        
      }else if(dataStatus == 1){
        var statusFilter =  { $and: [ { 'addressDetails.status'   : 1 }, 
                                      { 'bussinessDetails.status' : 1 }, 
                                      { 'bankDetails.status'      : 1 },
                                      { 'signature.status'        : 1 }  
                                    ] }
      }else{
        var statusFilter = { $and: [ 
                                    { $or: [  
                                        { 'addressDetails.status'   : 2 }, 
                                        { 'bussinessDetails.status' : 2 }, 
                                        { 'bankDetails.status'      : 2 },
                                        { 'signature.status'        : 2 }  
                                  ] },
                                    { 'addressDetails'   :{ $exists: true } }, 
                                    { 'bussinessDetails' :{ $exists: true } }, 
                                    { 'bankDetails'      :{ $exists: true } },
                                    { 'signature'        :{ $exists: true } },

                                    { 'addressDetails.status'   : {$ne : 0} }, 
                                    { 'bussinessDetails.status' : {$ne : 0} }, 
                                    { 'bankDetails.status'      : {$ne : 0} },
                                    { 'signature.status'        : {$ne : 0} }  
                             
                            ]}
         
      }




    let where              = {
                              $and: [
                                   statusFilter,
                                  {status : {$ne : "Inactive"}},
                                  {$or : [
                                    { "name": { $regex: `${searchText}`, $options: "i" } },
                                    { "phone": {$eq : searchText.trim()} },
                                    { "email":{$eq :  (searchText.trim())} } 
                                  ]}
                              ]
                            }
    let project ={
      _id             : 0,
      name            : 1,
      email           : 1,
      phone           : 1,
      status          : 1,
      profileStatus   : 1,
      seller_id       : 1
    }
    const pages = +(page);
    const limits = +(limit);
    const skip = (pages - 1) * limits;

    const [Records, count] = await Promise.all([
      await Seller.find(where,project).sort({ createdAt: -1 }).skip(skip).limit(limits).exec(),
      await Seller.countDocuments(where).exec()
    ])

    let returnValue = { status: true,details: Records, count: count  };
    return sendResponse.sendJson(returnValue, res);

  }catch(err){
    let returnValue = { status: false, message: "Some error  occured",  };
    return sendResponse.sendJson(returnValue, res);
  }
}

const profileApproveReject = async (req,res) =>{
  try{
    let data         = req.body
    let updateStatus = data.status 
    let id           = data.id ? data.id : ""
    let reason       = data.reason ? data.reason : ""
    let dataType     = data.type ? data.type : ""
    let seller       = await Seller.findOne({seller_id : id})
    let key          = (dataType == "address") ? "addressDetails"/* .status" */ : (dataType == "business") ? "bussinessDetails"/* .status" */ :  (dataType == "bank") ? "bankDetails"/* .status" */ : (dataType == "signature") ? "signature"/* .status" */ : ""
    let statusKey    = key + ".status"
    let checkStatus  = (dataType == "address") ? seller.addressDetails.status : (dataType == "business") ? seller.bussinessDetails.status :  (dataType == "bank") ? seller.bankDetails.status : (dataType == "signature") ? seller.signature.status : ""
    let reasonKey       = key +".reason"

    if(seller && seller.status !=  'Inactive' && checkStatus == 0 && updateStatus != 0 && checkStatus != updateStatus){
      if(updateStatus == 1 && key != ""){
        await Seller.updateOne({seller_id : id},{[statusKey] : updateStatus}).then(async function(result,err) {
          if (!err && result.acknowledged == true && result.modifiedCount >= 1) {
            let returnValue = { status: true, message: `${dataType} details was successfully approved`,  }
            return sendResponse.sendJson(returnValue, res);
          }else{
            let returnValue = { status: false, message: "Status updation error" };
            return sendResponse.sendJson(returnValue, res);
          }
        })
      }else if(updateStatus == 2 && reason && key != ""){
        await Seller.updateOne({seller_id : id},{[statusKey] : updateStatus, [reasonKey] : reason}).then(async function(result,err) {
          if (!err && result.acknowledged == true && result.modifiedCount >= 1) {
            let returnValue = { status: true, message: `${dataType} details was successfully rejected`  }
            return sendResponse.sendJson(returnValue, res);
          }else{
            let returnValue = { status: false, message: "Status updation error" };
            return sendResponse.sendJson(returnValue, res);
          }
        })
      }else{
        let Msg = (reason == "" && updateStatus == 2) ? "Reason required": ""
            Msg = (key == "")    ? "Profile type is required":Msg

        let returnValue = { status: false, message:Msg};
        return sendResponse.sendJson(returnValue, res);
      }
     
    }else{ 
      let Msg = (seller.status ==  'Inactive')                    ? "Account status is inacative": ""
          Msg = (checkStatus != 0 || checkStatus == updateStatus) ? "Already status updated": Msg
          Msg = (updateStatus == 0)                               ? "Only approve and reject action permited": Msg
      let returnValue = { status: false, message: Msg};
      return sendResponse.sendJson(returnValue, res);
    }

  }catch(err){
    let returnValue = { status: false, message: "Some error  occured",  };
    return sendResponse.sendJson(returnValue, res);
  }
}

const SellerRequestView = async (req,res) =>{
    try{
        let data        = req.body
        let searchText  = data.searchText ? data.searchText : ""
        let type        = data.type ? data.type : ""
        let status       = data.status ? data.status : 0
        let page        = data.page ? data.page : 1
        let limit       = data.limit ? data.limit : 0

        let queryObject = {};
  
        queryObject.status = status
  
      if (searchText.length > 0) {
        queryObject.$or = [
          { "sellerName": { $regex: `${searchText}`, $options: "i" } },
        ]
      }
      if (type.length > 0) {
        queryObject.type = type
      }
      const pages = +(page);
      const limits = +(limit);
      const skip = (pages - 1) * limits;
  
      const [sellerrequest, count] = await Promise.all([
        await sellerRequest.find(queryObject).sort({ createdAt: -1 }).skip(skip).limit(limits).exec(),
        await sellerRequest.countDocuments(queryObject).exec()
      ])

        let returnValue = { status: true, message: "", details: sellerrequest, count: count };
        return sendResponse.sendJson(returnValue, res);

    }catch(err){
        let returnValue = { status: false, message: "Some error  occured",  };
        return sendResponse.sendJson(returnValue, res);
    }
};

const requestApproveReject = async (req,res) =>{
  try{
    let data         = req.body
    let updateStatus = data.status 
    let id           = data.id ? data.id : ""
    let reason       = data.reason ? data.reason : ""

    let request       = await sellerRequest.findOne({_id : id},{_id:0,status:1,type : 1,value : 1, valueInObject :1,sellerId : 1})

    if(request){

      let sellerDetails = await Seller.findOne({seller_id : request.sellerId})

      if(request.type == "bank"){
        sellerDetails.bankDetails.holdername  = request.valueInObject.holdername,
        sellerDetails.bankDetails.accNumber   = request.valueInObject.accNumber,
        sellerDetails.bankDetails.ifscCode    = request.valueInObject.ifscCode,
        sellerDetails.bankDetails.bankName    = request.valueInObject.bankName,
        sellerDetails.bankDetails.state       = request.valueInObject.state,
        sellerDetails.bankDetails.city        = request.valueInObject.city,
        sellerDetails.bankDetails.branch      = request.valueInObject.branch,
        sellerDetails.bankDetails.status      = 1
      }
      else if(request.type == "address"){
          sellerDetails.addressDetails.address  = request.valueInObject.address,
          sellerDetails.addressDetails.pincode  = request.valueInObject.pincode,
          sellerDetails.addressDetails.city     = request.valueInObject.city,
          sellerDetails.addressDetails.state    = request.valueInObject.state,
          sellerDetails.addressDetails.landmark = request.valueInObject.landmark,
          sellerDetails.addressDetails.altermobile_no = request.valueInObject.altermobile_no,
          sellerDetails.addressDetails.status   = 1
        
      }
     else if(request.type == "mobile-number"){
        sellerDetails.phone =  request.value

      }
      if(updateStatus == 1 && request.status == 0 ){
            await sellerDetails.save()
            await sellerRequest.updateOne({_id : id},{$set : {status : updateStatus}}) 
            let returnValue = { status: true, message: `${request.type} details was successfully approved`  }
            return sendResponse.sendJson(returnValue, res);

      }else if(updateStatus == 2 && request.status == 0 && reason){

        await sellerRequest.updateOne({_id : id},{$set : {status : updateStatus,reason : reason}}).then(async function(result,err) {
          if (!err && result.acknowledged == true && result.modifiedCount >= 1) {
            let returnValue = { status: true, message: `${request.type} details was successfully rejected`,  }
            return sendResponse.sendJson(returnValue, res);
          }else{
            let returnValue = { status: false, message: "Status updation error" };
            return sendResponse.sendJson(returnValue, res);
          }
        })
      }else{
        let Msg = (reason == "" && updateStatus == 2) ? "Reason required": ""
            Msg = (request.status != 0)    ? "status already updated":Msg
  
  
        let returnValue = { status: false, message:Msg};
        return sendResponse.sendJson(returnValue, res);
      }
    }else{
      let returnValue = { status: false, message: "Request not found"  };
      return sendResponse.sendJson(returnValue, res);
    }
    
  }catch(err){
    let returnValue = { status: false, message: "Some error  occured",  };
    return sendResponse.sendJson(returnValue, res);
  }
}

const sellerPayRequestView = async (req,res) =>{
  try{
    let data        = req.body
    let searchText  = data.searchText ? data.searchText : ""
    let type        = data.type ? data.type : ""
    let status       = data.status ? data.status : 0
    let page        = data.page ? data.page : 1
    let limit       = data.limit ? data.limit : 0


  let queryObject = {status : status};

  if (searchText.length > 0) {
    queryObject.$or = [
      { "sellerName": { $regex: `${searchText}`, $options: "i" } },
    ]
  }

  const pages = +(page);
  const limits = +(limit);
  const skip = (pages - 1) * limits;

  const [payrequest, count] = await Promise.all([
    await payRequest.find(queryObject).sort({ createdAt: -1 }).skip(skip).limit(limits).exec(),
    await payRequest.countDocuments(queryObject).exec()
  ])

    let returnValue = { status: true, message: "", details: payrequest, totalDoc: count };
    return sendResponse.sendJson(returnValue, res);

  }catch(err){

      let returnValue = { status: false, message: "Some error  occured",  };
      return sendResponse.sendJson(returnValue, res);
  }
}

const singlePayRequestView = async (req,res) =>{
  try{
    let data        = req.body
    let id          = data.id ? data.id : ""

    const paymentRequest = await payRequest.findOne({_id :id})
  
    let returnValue = { status: true, details: paymentRequest };
    return sendResponse.sendJson(returnValue, res);

  }catch(err){
      let returnValue = { status: false, message: "Some error  occured",  };
      return sendResponse.sendJson(returnValue, res);
  }
}

const payOrderDetails = async (req,res) =>{
  try{
    let data        = req.body
    let id          = data.id ? data.id : ""

    const paymentRequest = await payRequest.findOne({_id :id})

    if( paymentRequest && paymentRequest.orderId.length > 0){
      const sellerId = paymentRequest.sellerId
      const sellerDetails = await Seller.findOne({sellerId:sellerId},{_id:0,email:1,phone:1,GSTINnumber:1})


      let orderIdArray = paymentRequest.orderId
      let arr =[]
      for (let i = 0; i < orderIdArray.length; i++) {
        const orderId = orderIdArray[i]._id
        const cartsId = orderIdArray[i].cartId

        const order = await Orders.findOne({ _id: orderId}, { _id: 0 });
        if(order){

          let products  = order.cart.filter(product => product.variantProductId == cartsId)
          let product   = order.cart.filter(product => product._id == cartsId)
          if(products.length > 0 || product.length > 0 ){
            
            let orderData = (products.length > 0) ? products[0] : product[0]
            arr.push(orderData)
          }

        }else{
          let returnValue = { status: false, message: "Order not found" };
          return sendResponse.sendJson(returnValue, res);
        }
        
      }

      const details = {
        requestDetail : paymentRequest,
        orderData     : arr,
        sellerDetails : sellerDetails
      }
      let returnValue = { status: true, details: details };
      return sendResponse.sendJson(returnValue, res);

    }else{
      let returnValue = { status: false, message: "No orders found",  };
      return sendResponse.sendJson(returnValue, res);

    }

  }catch(err){

      let returnValue = { status: false, message: "Some error  occured",  };
      return sendResponse.sendJson(returnValue, res);
  }
}

const payRequestApproveReject = async (req,res) =>{
  try{
    let data          = req.body
    let updateStatus  = data.status 
    let id            = data.id ? data.id : ""
    let reason        = data.reason ? data.reason : ""
    let transactionId = data.transactionId ? data.transactionId : ""
    let paidAmount    = data.paidAmount ? data.paidAmount : ""

    let request       = await payRequest.findOne({_id : id},{_id:0})

    if(request){
      if(paidAmount && (paidAmount != request.amountValue )){
        let returnValue = { status: true, message: `Kindly enter correct amount.`,  }
        return sendResponse.sendJson(returnValue, res);
      }
      if(updateStatus == 1 && request.status == 0 && transactionId && paidAmount){
        let arr = []
        let data = request.orderId
        for (let i = 0; i < data.length; i++) {
          const orderId = data[i]._id
          const cartId = data[i].cartId
          await Orders.updateOne({_id :orderId,  cart: { '$elemMatch': { _id: (cartId) } } },{ $set: {'cart.$.sellerPaymentStatus': "Paid"} })
        }
      
            await payRequest.updateOne({_id : id},{$set : {status : updateStatus, transactionId : transactionId, paidAmount : paidAmount }}) 
            let returnValue = { status: true, message: `Payment request was successfully approved`,  }
            return sendResponse.sendJson(returnValue, res);

      }else if(updateStatus == 2 && request.status == 0 && reason){

        await payRequest.updateOne({_id : id},{$set : {status : updateStatus,reason : reason}}).then(async function(result,err) {
          if (!err && result.acknowledged == true && result.modifiedCount >= 1) {
            let arrayList = request.orderId
            for (let i = 0; i < arrayList.length; i++) {
              const orderId = arrayList[i]._id
              const cartId = arrayList[i].cartId
              await Orders.updateOne({_id :orderId,  cart: { '$elemMatch': { _id: (cartId) } } },{ $set: {'cart.$.requestAdded': false} })
              
            }
            let returnValue = { status: true, message: `Payment request was successfully rejected`,  }
            return sendResponse.sendJson(returnValue, res);
          }else{
            let returnValue = { status: false, message: "Status updation error" };
            return sendResponse.sendJson(returnValue, res);
          }
        })
      }else{
        let Msg = (reason == "" && updateStatus == 2) ? "Reason required": ""
            Msg = (request.status != 0)    ? "status already updated":Msg
            Msg = (updateStatus == 1 && request.status == 0 && transactionId == "" ) ? "Transaction id is required":Msg
            Msg = (updateStatus == 1 && request.status == 0 && paidAmount == "" ) ? "Paid amount is required":Msg

  
        let returnValue = { status: false, message:Msg};
        return sendResponse.sendJson(returnValue, res);
      }
    }else{
      let returnValue = { status: false, message: "Request not found"  };
      return sendResponse.sendJson(returnValue, res);
    }
    
  }catch(err){
    let returnValue = { status: false, message: "Some error  occured",  };
    return sendResponse.sendJson(returnValue, res);
  }
}

const sellerProducts = async (req,res) =>{
  try{
    let data        = req.body
    let searchText  = data.searchText ? data.searchText : ""
    let status      = data.status ? data.status : 0
    let page        = data.page ? data.page : 1
    let limit       = data.limit ? data.limit : 0


  let queryObject = {aprovalStatus : status};

  if (searchText.length > 0) {
    queryObject.$or = [
      { "sellerName": { $regex: `${searchText}`, $options: "i" } },
    ]
  }

  const pages = +(page);
  const limits = +(limit);
  const skip = (pages - 1) * limits;

  const [productList, count] = await Promise.all([
    await Products.find(queryObject).sort({ createdAt: -1 }).skip(skip).limit(limits).exec(),
    await Products.countDocuments(queryObject).exec()
  ])

    let returnValue = { status: true, message: "", details: productList, count: count };
    return sendResponse.sendJson(returnValue, res);

  }catch{

      let returnValue = { status: false, message: "Some error  occured",  };
      return sendResponse.sendJson(returnValue, res);
  }
}

const sellerProductApproveReject = async (req,res) =>{
  try{
    let data          = req.body
    let updateStatus  = data.status 
    let id            = data.id ? data.id : ""
    let reason        = data.reason ? data.reason : ""

    let product       = await Products.findOne({_id : id},{_id:0})
    if(product){
      if(updateStatus == 1 && product.aprovalStatus == 0 ){

            await Products.updateOne({_id : id},{$set : {aprovalStatus : updateStatus,status :"show"}}) 
            let returnValue = { status: true, message: `Product approved successfully`  }
            return sendResponse.sendJson(returnValue, res);

      }else if(updateStatus == 2 && product.aprovalStatus == 0 && reason){

        await Products.updateOne({_id : id},{$set : {aprovalStatus : updateStatus,reason : reason}}).then(async function(result,err) {
          if (!err && result.acknowledged == true && result.modifiedCount >= 1) {
            let returnValue = { status: true, message: `Product rejected successfully`   }
            return sendResponse.sendJson(returnValue, res);
          }else{
            let returnValue = { status: false, message: "Status updation error" };
            return sendResponse.sendJson(returnValue, res);
          }
        })
      }else{
        let Msg = (reason == "" && updateStatus == 2) ? "Reason required": ""
            Msg = (product.status != 0)    ? "status already updated" : Msg

        let returnValue = { status: false, message:Msg};
        return sendResponse.sendJson(returnValue, res);
      }
    }else{
      let returnValue = { status: false, message: "Product not found"  };
      return sendResponse.sendJson(returnValue, res);
    }
  }catch(err){
    let returnValue = { status: false, message: "Some error  occured",  };
    return sendResponse.sendJson(returnValue, res);
  }
}
module.exports = {
    SellerView, singleSellerView, sellerStatusUpdate, sellerProfileDetails, profileApproveReject, SellerRequestView, requestApproveReject, sellerPayRequestView, singlePayRequestView, payRequestApproveReject,
    sellerProductApproveReject, sellerProducts,payOrderDetails
};

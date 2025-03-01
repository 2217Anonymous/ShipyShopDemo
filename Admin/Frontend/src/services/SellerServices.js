import requests from './httpService';

const SellerServices = {

  getAllSeller: async (body) => {
    return requests.post('/seller/sellerView', body);
  },

  viewSingleSeller: async (body) => {
    return requests.post('/seller/singleSellerView', body);
  },

  ApproveRejectUpdate: async (body) => {
    return requests.post('/seller/profileApproveReject', body);
  },

  changeRequestCall: async (body) => {
    return requests.post('/seller/SellerRequestView', body);
  },

  changeRequestApproveReject: async (body) => {
    return requests.post('/seller/requestApproveReject', body);
  },
  payRequesttApproveReject: async (body) => {
    return requests.post('/seller/payRequestApproveReject', body);
  },

  addBanner: async (body) => {
    return requests.post('/templete/addtemplete', body);
  },

  updateBanner: async (body) => {
    return requests.post('/templete/updateTemplete', body);
  },

  getBannerById: async (body) => {
    return requests.post('/templete/singleviewTemplete', body);
  },


  getAllTicket: async (body) => {
    return requests.post('/templete/viewAllSupport', body);
  },

  replyTicket: async (body) => {
    return requests.post('/templete/replySupport', body);
  },

  deleteBanner: async (body) => {
    return requests.post('/templete/deleteTemplete', body)
  },


  addAllCoupon: async (body) => {
    return requests.post('/coupon/add/all', body);
  },
  getAllCoupons: async () => {
    return requests.get('/coupon');
  },


  updateManyCoupons: async (body) => {
    return requests.patch('/coupon/update/many', body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/coupon/status/${id}`, body);
  },
  deleteCoupon: async (id) => {
    return requests.delete(`/coupon/${id}`);
  },
  deleteManyCoupons: async (body) => {
    return requests.patch(`/coupon/delete/many`, body);
  },


  sellerPayRequestView: async (body) => {
    return requests.post(`/seller/payRequestView`, body);
  },
  sellerPayOrderview: async (body) => {
    return requests.post(`/seller/payOrderDetails`, body);
  },
  sellerPayApproveReject: async (body) => {
    return requests.post(`/seller/payRequestApproveReject`, body);
  },
};

export default SellerServices;

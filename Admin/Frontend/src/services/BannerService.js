import requests from './httpService';

const BannerService = {

  getAllProducts: async (body) => {
    return requests.post('/templete/viewTempletes', body);        
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

  deleteBanner : async (body)=>{
    return requests.post('/templete/deleteTemplete',body)
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
};

export default BannerService;


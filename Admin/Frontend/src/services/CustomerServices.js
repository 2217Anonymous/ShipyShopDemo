import requests from "./httpService";

const CustomerServices = {
  getAllCustomers: async (body) => {
    return requests.post(`/customer/getAllCustomers`,body);
  },

  addAllCustomers: async (body) => {
    return requests.post("/customer/add/all", body);
  },
  // user create
  createCustomer: async (body) => {
    return requests.post(`/customer/create`, body);
  },

  filterCustomer: async (email) => {
    return requests.post(`/customer/filter/${email}`);
  },

  getCustomerById: async (body) => {
    return requests.post(`/customer/singleCustomerView`, body);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },


  updateCustomerStatus: async (body) => {
    return requests.post(`/customer/updateCusStatus`, body);
  },

  deleteCustomer: async (id) => {
    return requests.delete(`/customer/${id}`);
  },
};

export default CustomerServices;

import requests from "./httpService";

const AdminServices = {
  registerAdmin: async (body) => {
    return requests.post("/admin/register", body);
  },

  loginOTP : async (body) => {
    return requests.post(`/admin/loginOTP`, body);
  },

  loginAdmin: async (body) => {
    return requests.post(`/admin/login`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/admin/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/admin/reset-password", body);
  },

  signUpWithProvider: async (body) => {
    return requests.post("/admin/signup", body);
  },

  addStaff: async (body) => {
    return requests.post("/admin/add", body);
  },
  getAllStaff: async (body) => {
    return requests.get("/admin", body);
  },
  getStaffById: async (id, body) => {
    return requests.post(`/admin/${btoa(id)}`, body);
  },

  updatePassord: async (body) => {
    return requests.post(`/admin/updatepassord`, body);
  },

  updatePattern: async (body) => {
    return requests.post(`/admin/updatepattern`, body);
  },

  updateStaff: async (id, body) => {
    return requests.put(`/admin/${btoa(id)}`, body);
  },

  updateStaffStatus: async (id, body) => {
    return requests.put(`/admin/update-status/${id}`, body);
  },

  deleteStaff: async (id) => {
    return requests.delete(`/admin/${id}`);
  },
};

export default AdminServices;

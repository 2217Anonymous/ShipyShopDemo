import axios from "axios"

// axios.defaults.baseURL = "http://localhost:8000/api/";

// export const Axios = axios.create({
//     baseURL: 'http://localhost:5000/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     },
// });

// Axios.interceptors.request.use(
//   config => {
//     config.headers.authorization = `Bearer ${accessToken}`;
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );
// Axios.interceptors.response.use(
//   config => {
//     return config
//   },
//   error => {
//     if(error.response.status === 401){
//       ToastLeft('Session expired! Please login again.', 'Failed')
//     }
//     else if(error.response.status === 400){
//       const errors = Object.keys(error.response.data.errors).map(res => (
//         `${error.response.data.errors[res]}`
//       ))  
//       ToastLeft(errors.join('\n\n'), 'Failed');
//     }
//     else {
//       return ToastLeft('An error has occurred. Please contact the administrator for assistance.','Failed')
//     }
//     return Promise.reject(error);
//   }
// );

export const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

//ACCOUNT
export const ADMIN_LOGIN_URL = "/admin-login";
export const SELLER_LOGIN_URL = "/seller-login";
export const SELLER_REGISTER_URL = "/seller-register";
export const LOGOUT_URL = "/logout";

//SELLERS
export const GET_SELLERS = "/get-sellers";
export const GET_SELLER = "/get-seller";
export const GET_REQUEST_SELLER = "/request-seller-get";
export const GET_DEACTIVE_SELLERS = "/get-deactive-sellers";
export const SELLER_STATUS_UPDATE = "/seller-status-update";

import axios from 'axios';
import Cookie from "js.cookie";
const instance = axios.create({
  // baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  // baseURL:' https://ecommerce-react-aback.biovustech.com/api',
  baseURL : 'https://shipyshopdemo.onrender.com/api',
  // baseURL : 'http://192.168.29.65:7000/api',
  // baseURL : 'http://localhost:7000/api',

  timeout: 50000,
  headers: {
    // Accept: 'application/json',
    // 'Content-Type': 'application/json',
    // "Content-Type":imageApi.includes(serviceName) ? "multipart/form-data" : "application/json;charset=UTF-8",
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  let adminInfo;
  if (Cookie.get('adminInfo')) {
    adminInfo = JSON.parse(Cookie.get('adminInfo'));
  }

  let company;

  if (Cookie.get('company')) {
    company = Cookie.get('company');
  }

  let imageApi = [`/products/updateProduct/${config?.updateId}`]
  if(imageApi.includes(config.url)){
  }
  
  // let companyName = JSON.stringify(company);
  return {
    ...config,
    headers: {
      authorization: adminInfo ? `Bearer ${adminInfo.token}` : null,
      company: company ? company : null,
      "Content-Type":imageApi.includes(config.url) ? "multipart/form-data" : "application/json",
    },
  };
});

const responseBody = (response) => {
  // console.log(response.data.payload.code)
  // if(response.data.payload.code === 401){
  //   window.location.href="/"
  // }
  return response.data.payload ? response.data.payload : response.data 
};
const requests = {
  get: (url, body, headers) => instance.get(url, body, headers).then(responseBody),

  post: (url, body,updatedId) => instance.post(url, body,updatedId).then(responseBody),

  put: (url, body, headers) =>
  instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => 
  instance.patch(url, body).then(responseBody),

  delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default requests;

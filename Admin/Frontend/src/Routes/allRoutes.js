import React from "react";
import { Navigate } from "react-router-dom";

import { lazy } from "react";

// use lazy for better code splitting
//LOGIN
const Login = lazy(() => import("../pages/Authentication/Login"));
const SellerLogin = lazy(() => import("../pages/Authentication/SellerLogin"));
const SellerRegister = lazy(() => import("../pages/Authentication/SellerRegister"));

//DASHBOARD
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Categories = lazy(() => import("../pages/Masters/Categories"));
const Attributes = lazy(() => import("../pages/Masters/Attributes"))
const AttributesValues = lazy(() => import("../pages/Masters/Attributes/AttributeValues"))
const Products = lazy(() => import("../pages/Prodducts/Products"))
const AddProducts = lazy(() => import("../pages/Prodducts/AddProducts"))
const ProductDetails = lazy(() => import("../pages/Prodducts/ProductDetails"))
const Sellers = lazy(() => import("../pages/Seller"))

//AUTH PROTECTECTD ROUTES
const authProtectedRoutes = [
  { path: "/", component: <Navigate to="/dashboard" />, exact: true, },
  { path: "*", component: <Navigate to="/dashboard" /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/products", component: <Products /> },
  { path: "/add-product", component: <AddProducts /> },
  { path: "/product/:param", component: <AddProducts /> },
  { path: "/product-details/:param", component: <ProductDetails /> },
  { path: "/index", component: <Dashboard /> },
  { path: "/categories", component: <Categories /> },
  { path: "/attributes", component: <Attributes /> },
  { path: "/attribute/:param", component: <AttributesValues /> },
  { path: "/sellers", component: <Sellers /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/admin-login", component: <Login /> },
  { path: "/login", component: <SellerLogin /> },
  { path: "/seller-register", component: <SellerRegister /> },
];

export { authProtectedRoutes, publicRoutes };
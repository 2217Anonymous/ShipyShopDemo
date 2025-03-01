const express = require("express");
const router  = express.Router();
const multer = require("multer");

// var upload    = require('../config/multer')
const { isAuth } = require("../config/auth");
const upload = multer({
  storage: multer.diskStorage({}),})

const {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
  updateCommisionDetails
} = require("../controller/productController");

//add a product
router.post("/add",isAuth, addProduct);

//add multiple products
router.post("/all", addAllProducts);

//get a product
router.post("/:id", getProductById);

//get showing products only
router.get("/show", getShowingProducts);

//get showing products in store
router.get("/store", getShowingStoreProducts);

//get all products
router.get("/", getAllProducts);

//get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.post("/updateProduct/:id",upload.array("resizeImage",10), updateProduct);
//update many products
router.patch("/update/many", updateManyProducts);

//update a product status
router.put("/status/:id", updateStatus);

//delete a product
router.delete("/:id", deleteProduct);

//delete many product
router.patch("/delete/many", deleteManyProducts);
router.post("/updateCommisionDetails", updateCommisionDetails);


module.exports = router;

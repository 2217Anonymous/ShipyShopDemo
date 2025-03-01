const Product = require("../models/Product");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Attribute = require('../models/Attribute')
const Commission = require('../models/Commission')

const sendResponse = require("../guider/sendResponse");
const { uploadImages } = require('../config/helper')

const addProduct = async (req, res) => {
  try {
    let adminDetails = req.user

    const sellingPrice = req.body.prices.price // replace with the actual selling price
    const isFBF = true; // replace with true if Fulfilment by Flipkart, false otherwise
    let commissionTable = await Commission.find({}, { _id: 0 })

    const commissionFee = calculateCommission(sellingPrice, isFBF, commissionTable);


    const newProduct = new Product({
      ...req.body,
      // productId: cname + (count + 1),
      productId: req.body.productId
        ? req.body.productId
        : mongoose.Types.ObjectId(),
    });
    newProduct.commissionFee = commissionFee
    newProduct.insertById = adminDetails.AdminId;
    newProduct.insertByName = adminDetails.name;
    newProduct.insertByRole = adminDetails.role ? adminDetails.role : "Admin"

    await newProduct.save();
    let returnValue = { status: true, message: "", values: newProduct };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const addAllProducts = async (req, res) => {
  // try {
  //   await Product.deleteMany();
  //   await Product.insertMany(req.body);
  //   res.status(200).send({
  //     message: "Product Added successfully!",
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "show" }).sort({ _id: -1 });
    let returnValue = { status: true, message: "", values: products };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const getAllProducts = async (req, res) => {
  const { title, category, price, page, limit } = req.query;
  let queryObject = {};
  let sortObject = {};
  if (title) {
    queryObject.$or = [
      { "title.en": { $regex: `${title}`, $options: "i" } },
      { "title.de": { $regex: `${title}`, $options: "i" } },
      { "title.es": { $regex: `${title}`, $options: "i" } },
      { "title.bn": { $regex: `${title}`, $options: "i" } },
      { "title.sl": { $regex: `${title}`, $options: "i" } },
    ];
  }

  if (price === "low") {
    sortObject = {
      "prices.originalPrice": 1,
    };
  } else if (price === "high") {
    sortObject = {
      "prices.originalPrice": -1,
    };
  } else if (price === "published") {
    queryObject.status = "show";
  } else if (price === "unPublished") {
    queryObject.status = "hide";
  } else if (price === "status-selling") {
    queryObject.stock = { $gt: 0 };
  } else if (price === "status-out-of-stock") {
    queryObject.stock = { $lt: 1 };
  } else if (price === "date-added-asc") {
    sortObject.createdAt = 1;
  } else if (price === "date-added-desc") {
    sortObject.createdAt = -1;
  } else if (price === "date-updated-asc") {
    sortObject.updatedAt = 1;
  } else if (price === "date-updated-desc") {
    sortObject.updatedAt = -1;
  } else {
    sortObject = { _id: -1 };
  }


  if (category) {
    queryObject.categories = category;
  }

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" })
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    let getValues = {
      products,
      totalDoc,
      limits,
      pages,
    };
    let returnValue = { status: true, message: "", values: getValues };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: "some error occuered" };
    sendResponse.errorJSON(returnValue, res);
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    let returnValue = { status: true, message: "", values: product };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: `Slug problem, ${err.message}` };
    sendResponse.errorJSON(returnValue, res);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category", select: "_id, name" })
      .populate({ path: "categories", select: "_id name" });

      let returnValue = { status: true, message: "", values: product };
      sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    let files = req.files

    let sellingPrice = JSON.parse(req.body.prices)// replace with the actual selling price
    sellingPrice = sellingPrice.price
    const isFBF = true; // replace with true if Fulfilment by Flipkart, false otherwise
    let commissionTable = await Commission.find({}, { _id: 0 })

    const commissionFee = calculateCommission(sellingPrice, isFBF, commissionTable);

    let combinationCheck = req.body.isCombination
    if (combinationCheck == true) {
      let productVariants = req.body.variants

      let arr = []
      for (let j = 0; j < productVariants.length; j++) {
        const singleVariant = productVariants[j];
        const variantTypes = productVariants[j].varianttypes;

        const groupedValues = {};

        for (let k = 0; k < variantTypes.length; k++) {
          const singleTypeArr = variantTypes[k];
          let attributeList = [];

          attributeList[singleTypeArr] = singleVariant[singleTypeArr];
          const key = Object.keys(attributeList)[0]; // Get the key
          const value = attributeList[key]; // Get the value
          if (!groupedValues[key]) {
            groupedValues[key] = []; // Initialize an array for the key if it doesn't exist
          }
          groupedValues[key].push(value);
        }
        arr.push(groupedValues)
      }
      const groupedData = {};
      arr.forEach(item => {
        for (const key in item) {
          if (!groupedData[key]) {
            groupedData[key] = [];
          }
          groupedData[key] = groupedData[key].concat(item[key]);
        }
      });
      let Arr = []

      const keys = Object.keys(groupedData);

      // Iterate through the keys and values
      for (const key of keys) {
        const values = groupedData[key];
        for (const valueArray of values) {
          for (const value of valueArray) {
            let attributesId = await Attribute.aggregate([
              { '$unwind': '$variants' },
              { '$match': { "name.en": key, 'variants.name.en': value } },
              { '$project': { _id: 0, variants: 1, item: key, variantId: '$_id' } }
            ])

            Arr.push(attributesId[0])
          }
        }
      }
      const groupedProducts = {};
      for (const product of Arr) {
        const item = product.item;
        if (!groupedProducts[item]) {
          groupedProducts[item] = [];
        }
        product.variants.variantId = product.variantId
        groupedProducts[item].push(product.variants);
      }

      var attributes = groupedProducts
    } else {
      var attributes = []
    }
    uploadImages(files, async (imgRes) => {

      const product = await Product.findById(req.params.id);

      if (imgRes.length > 0) {
        var ResizeImage = imgRes
      } else {
        var ResizeImage = product.resizeImage
      }
      if (product) {

        product.title = { ...product.title, ...JSON.parse(req.body.title) };
        product.description = {
          ...product.description,
          ...JSON.parse(req.body.description),
        };

        product.productId = req.body.productId;
        product.designcode = req.body.designcode;
        product.sku = req.body.sku;
        product.barcode = req.body.barcode;
        product.slug = req.body.slug;
        product.categories = JSON.parse(req.body.categories);
        product.category = req.body.category;
        product.show = req.body.show;
        product.isCombination = req.body.isCombination;
        product.variants = JSON.parse(req.body.variants);
        product.stock = req.body.stock;
        product.prices = JSON.parse(req.body.prices);
        product.image = JSON.parse(req.body.image);
        product.tag = req.body.tag;
        product.shippingCost = req.body.shippingCost
        product.returnPolicy = req.body.returnPolicy
        product.shortDescription = JSON.parse(req.body.shortDescription),
          product.type = JSON.parse(req.body.type),
          product.brand = JSON.parse(req.body.brand),
          product.material = JSON.parse(req.body.material)
        product.attributeArray = attributes
        product.resizeImage = ResizeImage
        product.commissionFee = commissionFee


        await product.save();
        let returnValue = { status: true, message: "Product updated successfully!", values: product };
        sendResponse.sendJson(returnValue, res);
      } else {
        let returnValue = { status: false, message: "Product Not Found!" };
        sendResponse.errorJSON(returnValue, res);
      }
    })

  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const updateManyProducts = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }


    await Product.updateMany(
      { _id: { $in: req.body._id } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );

    let returnValue = { status: true, message: "Product updated successfully!" };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const updateStatus = (req, res) => {
  const newStatus = req.body.status;
  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        let returnValue = { status: false, message: err.message };
        sendResponse.errorJSON(returnValue, res);
      } else {
        let returnValue = { status: true, message: `Product ${newStatus} Successfully!` };
        sendResponse.sendJson(returnValue, res);
      }
    }
  );
};

const deleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      let returnValue = { status: false, message: err.message };
      sendResponse.errorJSON(returnValue, res);
    } else {
      let returnValue = { status: true, message: "Product Deleted Successfully!" };
      sendResponse.sendJson(returnValue, res);
    }
  });
};

const getShowingStoreProducts = async (req, res) => {
  try {
    const queryObject = {};

    const { category, title } = req.query;

    queryObject.status = "show";

    if (category) {
      queryObject.categories = {
        $in: [category],
      };
    }

    if (title) {
      queryObject.$or = [
        { "title.en": { $regex: `${title}`, $options: "i" } },
        { "title.de": { $regex: `${title}`, $options: "i" } },
        { "title.es": { $regex: `${title}`, $options: "i" } },
        { "title.bn": { $regex: `${title}`, $options: "i" } },
        { "title.sl": { $regex: `${title}`, $options: "i" } },
        { slug: `${title}` },
      ];
    }

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "name _id" })
      .sort({ _id: -1 })
      .limit(100);

    const relatedProduct = await Product.find({
      category: products[0]?.category,
    }).populate({ path: "category", select: "_id name" });

    res.send({
      products,
      relatedProduct,
    });
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const deleteManyProducts = async (req, res) => {
  // try {
  //   const cname = req.cname;
  //   await Product.deleteMany({ _id: req.body.ids });

  //   res.send({
  //     message: `Products Delete Successfully!`,
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const updateCommisionDetails = async (req, res) => {
  try {
    const { id, fbf, nfbf } = req.body;
    const commission = await Commission.findById(id);
    if (commission) {
      commission.fbf = fbf
      commission.nfbf = nfbf

      await commission.save()

      let returnValue = { status: true, message: "Successfully updated" };
      sendResponse.sendJson(returnValue, res);
    } else {
      let returnValue = { status: false, message: "No data found" };
      sendResponse.sendJson(returnValue, res);
    }

  } catch {
    let returnValue = { status: false, message: "some error occuered" };
    sendResponse.sendJson(returnValue, res);
  }
}

function calculateCommission(sellingPrice, isFBF, commissionTable) {
  const commissionInfo = commissionTable.find((entry) => {
    return (
      sellingPrice >= entry.range.min &&
      (sellingPrice <= entry.range.max || !isFinite(entry.range.max))
    );
  });

  if (commissionInfo) {
    return isFBF ? commissionInfo.fbf : commissionInfo.nfbf;
  }

  // Return a default value or handle the case when no matching range is found
  return 0;
}


module.exports = {
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
};

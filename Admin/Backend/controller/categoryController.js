const browser       = require('browser-detect');
const sendResponse  = require("../guider/sendResponse");
const clean         = require("../guider/clean");
const isCheck       = require("../guider/i2aNKmqBUD");
const adminActivity = require("../guider/adminActivity");
const Category      = require("../models/Category");
const flacksTable    = require('../models/flacks')
const addCategory = async (req, res) => {
  try {
    let data          = req.body;    
    let users         = req.user;
    let ipAddr        = await isCheck.getIpadderss(req);
    let insertValue   = {};
    insertValue.name  = data.name
    insertValue.description  = data.description
    insertValue.slug  = data.slug ? await clean.removeXss(data.slug.toLowerCase()) : ""
    insertValue.parentId  = data.parentId ? await clean.removeXss(data.parentId.toLowerCase()) : ""
    insertValue.parentName  = data.parentName ? await clean.removeXss(data.parentName.toLowerCase()) : ""
    insertValue.id  = data.id ? await clean.removeXss(data.id.toLowerCase()) : ""
    insertValue.icon  = data.icon ? await clean.removeXss(data.icon.toLowerCase()) : ""
    insertValue.status  = data.status ? await clean.removeXss(data.status.toLowerCase()) : ""

    const newCategory = new Category(insertValue);
    await newCategory.save();
    await flacksTable.updateOne({tableName:"Category"},{$set : {status : 1}})
    
    let description = `Category Added Successfully!`;
    await adminActivity.adminActivity(users.name,`Category-Add`, description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,users._id)
    let returnValue = {status:true,message:description};
    sendResponse.sendJson(returnValue,res);
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.errorJSON(returnValue,res);
  }
};

// all multiple category
const addAllCategory = async (req, res) => {
  // try {
  //   await Category.deleteMany();

  //   await Category.insertMany(req.body);

  //   res.status(200).send({
  //     message: "Category Added Successfully!",
  //   });
  // } catch (err) {

  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

// get status show category
const getShowingCategory = async (req, res) => {
  try {
    const categories = await Category.find({ status: "show" }).sort({
      _id: -1,
    });

    const categoryList = readyToParentAndChildrenCategory(categories);
    res.send(categoryList);
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.errorJSON(returnValue,res);
  }
};

// get all category parent and child
const getAllCategory = async (req, res) => {
  try {

    const categories = await Category.find({}).sort({ _id: -1 });
    const categoryList = readyToParentAndChildrenCategory(categories);
    let returnValue = {status:true,message:"",values:categoryList};
    sendResponse.sendJson(returnValue,res);
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.errorJSON(returnValue,res);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    res.send(categories);
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.errorJSON(returnValue,res);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    // res.send(category);
    let returnValue = {status:true,message:"",values:category};
    sendResponse.sendJson(returnValue,res);
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.errorJSON(returnValue,res);
  }
};

// category update
const updateCategory = async (req, res) => {
  try {
    let users         = req.user;
    let ipAddr        = await isCheck.getIpadderss(req);
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = { ...category.name, ...req.body.name };
      category.description = {
        ...category.description,
        ...req.body.description,
      };
      category.icon = req.body.icon ? await clean.removeXss(req.body.icon.toLowerCase()) : "";
      category.status = req.body.status ? await clean.removeXss(req.body.status.toLowerCase()) : "";
      category.parentId = req.body.parentId
        ? req.body.parentId
        : category.parentId;
      category.parentName = req.body.parentName;
      
      await category.save();
      await flacksTable.updateOne({tableName:"Category"},{$set : {status : 1}})
      let description = 'Category Updated Successfully!';
      await adminActivity.adminActivity(users.name,`Category-Update`, description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,users._id)
      let returnValue = {status:true,message:description};
      sendResponse.sendJson(returnValue,res);
    }
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.errorJSON(returnValue,res);
  }
};

// udpate many category
const updateManyCategory = async (req, res) => {
  // try {
  //   const updatedData = {};
  //   for (const key of Object.keys(req.body)) {
  //     if (
  //       req.body[key] !== "[]" &&
  //       Object.entries(req.body[key]).length > 0 &&
  //       req.body[key] !== req.body.ids
  //     ) {
  //       updatedData[key] = req.body[key];
  //     }
  //   }

  //   await Category.updateMany(
  //     { _id: { $in: req.body.ids } },
  //     {
  //       $set: updatedData,
  //     },
  //     {
  //       multi: true,
  //     }
  //   );

  //   res.send({
  //     message: "Categories update successfully!",
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

// category update status
const updateStatus = async (req, res) => {
  try {
    const newStatus   = req.body.status;
    let users         = req.user;
    let ipAddr        = await isCheck.getIpadderss(req);
    await Category.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );

    let description = `Category ${ newStatus === "show" ? "Activated" : "Deactivated" } Successfully!`;
    await adminActivity.adminActivity(users.name,`Category-Update`, description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,users._id)
    let returnValue = {status:true,message:description};
    sendResponse.sendJson(returnValue,res);
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.errorJSON(returnValue,res);
  }
};
//single category delete
const deleteCategory = async (req, res) => {
  try {
    let users         = req.user;
    let ipAddr        = await isCheck.getIpadderss(req);
    await Category.deleteOne({ _id: req.params.id });
    await Category.deleteMany({ parentId: req.params.id });
    res.status(200).send({
      message: "Category Deleted Successfully!",
    });

    let description = `Category Deleted Successfully!`;
    await adminActivity.adminActivity(users.name,`Category-Delete`, description,ipAddr,browser(req.headers['user-agent']).name,browser(req.headers['user-agent']).os,users._id)
    let returnValue = {status:true,message:description};
    sendResponse.sendJson(returnValue,res);
  } catch (err) {
    let returnValue = {status:false,message:err.message};
    sendResponse.errorJSON(returnValue,res);
  }

  //This is for delete children category
  // Category.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $pull: { children: req.body.title },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({ message: err.message });
  //     } else {
  //       res.status(200).send({
  //         message: 'Category Deleted Successfully!',
  //       });
  //     }
  //   }
  // );
};

// all multiple category delete
const deleteManyCategory = async (req, res) => {
  // try {
  //   const categories = await Category.find({}).sort({ _id: -1 });

  //   await Category.deleteMany({ parentId: req.body.ids });
  //   await Category.deleteMany({ _id: req.body.ids });

  //   res.status(200).send({
  //     message: "Categories Deleted Successfully!",
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};
const readyToParentAndChildrenCategory = (categories, parentId = null) => {
  const categoryList = [];
  let Categories;
  if (parentId == null) {
    Categories = categories.filter((cat) => cat.parentId == undefined);
  } else {
    Categories = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of Categories) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      icon: cate.icon,
      status: cate.status,
      children: readyToParentAndChildrenCategory(categories, cate._id),
    });
  }

  return categoryList;
};

module.exports = {
  addCategory,
  addAllCategory,
  getAllCategory,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  getAllCategories,
  updateManyCategory,
};

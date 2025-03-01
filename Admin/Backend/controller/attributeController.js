const Attribute = require("../models/Attribute");
const flacksTable = require('../models/flacks')

const { handleProductAttribute } = require("../lib/stock-controller/others");
const sendResponse = require("../guider/sendResponse");
const clean = require("../guider/clean");
const isCheck = require("../guider/i2aNKmqBUD");
const adminActivity = require("../guider/adminActivity");
const browser = require('browser-detect');

const addAttribute = async (req, res) => {
  try {
    let data = req.body;
    let users = req.user;
    let ipAddr = await isCheck.getIpadderss(req);
    let insertValue = {};
    insertValue.title = data.title
    insertValue.name = data.name
    insertValue.variants = data.variants
    insertValue.option = data.option ? await clean.removeXss(data.option) : ""
    insertValue.type = data.type ? await clean.removeXss(data.type.toLowerCase()) : ""
    // insertValue.status  = data.status ? await clean.removeXss(data.status.toLowerCase()) : ""

    const newAttribute = new Attribute(insertValue);
    await newAttribute.save();
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })

    let description = `Attribute Added Successfully!`;
    await adminActivity.adminActivity(users.name, `Attribute-Add`, description, ipAddr, browser(req.headers['user-agent']).name, browser(req.headers['user-agent']).os, users._id);

    let returnValue = { status: true, message: description };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};
// add child attributes
const addChildAttributes = async (req, res) => {
  try {
    const { id } = req.params;
    let users = req.user;
    let ipAddr = await isCheck.getIpadderss(req);
    const attribute = await Attribute.findById(id);
    await Attribute.updateOne(
      { _id: attribute._id },
      { $push: { variants: req.body } }
    );
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })

    let description = `Attribute Value Added Successfully!`;
    await adminActivity.adminActivity(users.name, `Attribute-Add`, description, ipAddr, browser(req.headers['user-agent']).name, browser(req.headers['user-agent']).os, users._id);
    let returnValue = { status: true, message: description };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const addAllAttributes = async (req, res) => {
  // try {
  //   await Attribute.deleteMany();
  //   await Attribute.insertMany(req.body);
  //   res.send({
  //     message: "Added all attributes successfully!",
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const getAllAttributes = async (req, res) => {
  try {
    const { type, option, option1 } = req.query;
    const attributes = await Attribute.find({
      $or: [{ type: type }, { $or: [{ option: option }, { option: option1 }] }],
    });
    let returnValue = { status: true, message: "", values: attributes };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const getShowingAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.aggregate([
      {
        $match: {
          status: "show",
          "variants.status": "show",
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          title: 1,
          name: 1,
          option: 1,
          createdAt: 1,
          updateAt: 1,
          variants: {
            $filter: {
              input: "$variants",
              cond: {
                $eq: ["$$this.status", "show"],
              },
            },
          },
        },
      },
    ]);
    let returnValue = { status: true, message: "", values: attributes };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const getShowingAttributesTest = async (req, res) => {
  try {
    const attributes = await Attribute.find({ status: "show" });
    let returnValue = { status: true, message: "", values: attributes };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};
// update many attribute
const updateManyAttribute = async (req, res) => {
  // try {
  //   await Attribute.updateMany(
  //     { _id: { $in: req.body.ids } },
  //     {
  //       $set: {
  //         option: req.body.option,
  //         status: req.body.status,
  //       },
  //     },
  //     {
  //       multi: true,
  //     }
  //   );

  //   res.send({
  //     message: "Attributes update successfully!",
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const getAttributeById = async (req, res) => {
  try {
    // let id = atob(req.params.id);
    let id = req.params.id;
    const attribute = await Attribute.findById(id);
    let returnValue = { status: true, message: "", values: attribute };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const getChildAttributeById = async (req, res) => {
  try {
    const { id, ids } = req.params;

    const attribute = await Attribute.findOne({
      _id: id,
    });

    const childAttribute = attribute.variants.find((attr) => {
      return attr._id == ids;
    });

    let returnValue = { status: true, message: "", values: childAttribute };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const updateAttributes = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (attribute) {
      attribute.title = { ...attribute.title, ...req.body.title };
      attribute.name = { ...attribute.name, ...req.body.name };
      attribute._id = req.params.id;
      //attribute.title = req.body.title;
      // attribute.name = req.body.name;
      attribute.option = req.body.option;
      attribute.type = req.body.type;
      // attribute.variants = req.body.variants;
    }
    await attribute.save();
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })

    let returnValue = { status: true, message: "Attribute updated successfully!", values: attribute };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

// update child attributes
const updateChildAttributes = async (req, res) => {
  try {
    const { attributeId, childId } = req.params;

    let attribute = await Attribute.findOne({
      _id: attributeId,
      "variants._id": childId,
    });

    if (attribute) {
      const att = attribute.variants.find((v) => v._id.toString() === childId);

      const name = {
        ...att.name,
        ...req.body.name,
      };

      await Attribute.updateOne(
        { _id: attributeId, "variants._id": childId },
        {
          $set: {
            "variants.$.name": name,
            "variants.$.status": req.body.status,
          },
        }
      );
    }
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })


    let returnValue = { status: true, message: "Attribute Value Updated Successfully!" };
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

// update many attribute
const updateManyChildAttribute = async (req, res) => {
  // try {
  //   // select attribute value
  //   const childIdAttribute = await Attribute.findById(req.body.currentId);

  //   const final = childIdAttribute.variants.filter((value) =>
  //     req.body.ids.find((value1) => value1 == value._id)
  //   );

  //   const updateStatusAttribute = final.map((value) => {
  //     value.status = req.body.status;
  //     return value;
  //   });

  //   // group attribute
  //   let totalVariants = [];
  //   if (req.body.changeId) {
  //     const groupIdAttribute = await Attribute.findById(req.body.changeId);
  //     totalVariants = [...groupIdAttribute.variants, ...updateStatusAttribute];
  //   }

  //   if (totalVariants.length === 0) {
  //     await Attribute.updateOne(
  //       { _id: req.body.currentId },
  //       {
  //         $set: {
  //           variants: childIdAttribute.variants,
  //         },
  //       },
  //       {
  //         multi: true,
  //       }
  //     );
  //   } else {
  //     await Attribute.updateOne(
  //       { _id: req.body.changeId },
  //       {
  //         $set: {
  //           variants: totalVariants,
  //         },
  //       },
  //       {
  //         multi: true,
  //       }
  //     );

  //     await Attribute.updateOne(
  //       { _id: req.body.currentId },
  //       {
  //         $pull: { variants: { _id: req.body.ids } },
  //       },
  //       {
  //         multi: true,
  //       }
  //     );
  //   }

  //   res.send({
  //     message: "Attribute Values update successfully!",
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

const updateStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;
    await Attribute.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })

    let returnValue = { status: true, message: `Attribute ${newStatus === "show" ? "Published" : "Un-Published"} Successfully!`,};
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const updateChildStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Attribute.updateOne(
      { "variants._id": req.params.id },
      {
        $set: {
          "variants.$.status": newStatus,
        },
      }
    );
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })

    let returnValue = { status: true, message: `Attribute Value ${newStatus === "show" ? "Published" : "Un-Published"} Successfully!`};
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const deleteAttribute = async (req, res) => {
  try {
    await Attribute.deleteOne({ _id: req.params.id });
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })

    let returnValue = { status: true, message: "Attribute Deleted Successfully!",};
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};
// delete child attribute
const deleteChildAttribute = async (req, res) => {
  try {
    const { attributeId, childId } = req.params;

    await Attribute.updateOne(
      { _id: attributeId },
      { $pull: { variants: { _id: childId } } }
    );

    await handleProductAttribute(attributeId, childId);
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })

    let returnValue = { status: true, message: "Attribute Value Deleted Successfully!",};
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const deleteManyAttribute = async (req, res) => {
  try {
    await Attribute.deleteMany({ _id: req.body.ids });
    await flacksTable.updateOne({ tableName: "Attributes" }, { $set: { status: 1 } })

    let returnValue = { status: true, message: `Attributes Delete Successfully!`};
    sendResponse.sendJson(returnValue, res);
  } catch (err) {
    let returnValue = { status: false, message: err.message };
    sendResponse.errorJSON(returnValue, res);
  }
};

const deleteManyChildAttribute = async (req, res) => {
  // try {
  //   await Attribute.updateOne(
  //     { _id: req.body.id },
  //     {
  //       $pull: { variants: { _id: req.body.ids } },
  //     },
  //     {
  //       multi: true,
  //     }
  //   );

  //   await handleProductAttribute(req.body.id, req.body.ids, "multi");
  //   res.send({
  //     message: `Attribute Values Delete Successfully!`,
  //   });
  // } catch (err) {
  //   res.status(500).send({
  //     message: err.message,
  //   });
  // }
};

module.exports = {
  addAttribute,
  addAllAttributes,
  getAllAttributes,
  getShowingAttributes,
  getAttributeById,
  updateAttributes,
  updateStatus,
  updateChildStatus,
  deleteAttribute,
  getShowingAttributesTest,
  deleteChildAttribute,
  addChildAttributes,
  updateChildAttributes,
  getChildAttributeById,
  updateManyAttribute,
  deleteManyAttribute,
  updateManyChildAttribute,
  deleteManyChildAttribute,
};

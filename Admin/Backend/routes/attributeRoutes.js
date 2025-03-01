const express = require('express');
const router = express.Router();
const { isAuth } = require("../config/auth");

const {
  addAttribute,
  addAllAttributes,
  getAllAttributes,
  getShowingAttributes,
  getAttributeById,
  updateAttributes,
  updateStatus,
  deleteAttribute,
  getShowingAttributesTest,
  updateChildStatus,
  deleteChildAttribute,
  addChildAttributes,
  updateChildAttributes,
  getChildAttributeById,
  updateManyAttribute,
  deleteManyAttribute,
  updateManyChildAttribute,
  deleteManyChildAttribute,
} = require('../controller/attributeController');

//add attribute
router.post('/add', isAuth, addAttribute);

//add all attributes
// router.post('/add/all', addAllAttributes);

// add child attribute
router.put('/add/child/:id', isAuth, addChildAttributes);

//get all attribute
router.get('/', isAuth, getAllAttributes);

// router.get('/show', getShowingProducts);
router.get('/show', isAuth, getShowingAttributes);

router.put('/show/test', isAuth, getShowingAttributesTest);

// update many attributes
// router.patch('/update/many', updateManyAttribute);

//get attribute by id
router.get('/:id', isAuth, getAttributeById);

// child get attributes by id
router.get('/child/:id/:ids', isAuth, getChildAttributeById);

//update attribute
router.put('/:id', isAuth, updateAttributes);

// update child attribute
// router.patch('/update/child/many', updateManyChildAttribute);

// update child attribute
router.put('/update/child/:attributeId/:childId', isAuth, updateChildAttributes);

//show/hide a attribute
router.put('/status/:id', isAuth, updateStatus);

// show and hide a child status
router.put('/status/child/:id', isAuth, updateChildStatus);

//delete attribute
router.delete('/:id', isAuth, deleteAttribute);

// delete child attribute
router.put('/delete/child/:attributeId/:childId', isAuth, deleteChildAttribute);

// delete many attribute
// router.patch('/delete/many', deleteManyAttribute);

// delete many child attribute
// router.patch('/delete/child/many', deleteManyChildAttribute);

module.exports = router;

const express = require('express');
const { isAuth } = require("../config/auth");
const router = express.Router();
const {
  addCategory,
  addAllCategory,
  getAllCategory,
  getAllCategories,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  updateManyCategory

} = require('../controller/categoryController');

//add a category
router.post('/add', isAuth, addCategory);

//add all category
router.post('/add/all', addAllCategory);

//get only showing category
router.get('/show', getShowingCategory);

//get all category
router.get('/', getAllCategory);
//get all category
router.get('/all', isAuth, getAllCategories);

//get a category
router.get('/:id', isAuth, getCategoryById);

//update a category
router.put('/:id', isAuth, updateCategory);

//show/hide a category
router.put('/status/:id', isAuth, updateStatus);

//delete a category
router.delete('/:id', isAuth, deleteCategory);

// delete many category
router.patch('/delete/many', deleteManyCategory);

// update many category
router.patch('/update/many', updateManyCategory);

module.exports = router;

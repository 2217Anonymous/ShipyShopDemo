const router = require('express').Router();
const { isAuth } = require('../config/auth');
const {createBlog,deleteBlog,singleBlog,updateBlog,viewBlog} = require('../controller/blogController')
const { CommonDecode } = require("../guider/clean");


router.post('/createBlog',isAuth,CommonDecode,createBlog)
router.put('/updateBlog',isAuth,CommonDecode,updateBlog)
router.post('/singleBlog',isAuth,CommonDecode,singleBlog)
router.post('/viewBlog',isAuth,CommonDecode,viewBlog)
router.delete('/deleteBlog',isAuth,CommonDecode,deleteBlog)

module.exports = router;
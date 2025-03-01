const { isAuth } = require("../config/auth");
const { addTemplete, updateTemplete, viewTempletes, singleviewTemplete, deleteTemplete, viewAllSupport, viewSingleSupport, replySupport } = require("../controller/templeteController");
const { CommonDecode } = require("../guider/clean");

const router = require("express").Router();


router.post('/addtemplete', isAuth, CommonDecode, addTemplete)
router.post('/updateTemplete', isAuth, CommonDecode, updateTemplete)
router.post('/viewTempletes', isAuth, CommonDecode, viewTempletes)
router.post('/singleviewTemplete', isAuth, CommonDecode, singleviewTemplete)
router.post('/deleteTemplete', isAuth, /* CommonDecode, */ deleteTemplete)

//support Ticket

router.post('/viewAllSupport', isAuth,  viewAllSupport)
router.post('/viewSingleSupport', isAuth,  viewSingleSupport)
router.post('/replySupport', isAuth,  replySupport)



module.exports = router;
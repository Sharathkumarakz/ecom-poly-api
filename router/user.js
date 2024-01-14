const express = require("express");
const userRoute = express();

/**
 * Controllers
 */
const authController = require('../controllers/user/authController');
const productController = require('../controllers/user/productController');

const { userAuthentication } = require("../middleware/authentication");


userRoute.post('/register',authController.register)

userRoute.post('/login',authController.login)

userRoute.post('/resend-otp',authController.resendOtp)

userRoute.post('/otp-verification',authController.verifyOtp)

userRoute.get('/user/get-user-details',userAuthentication,authController.getUserDetails)

userRoute.get('/categories',productController.categories)

userRoute.post('/product-by-main-category',productController.getProductByMainCategory)

userRoute.post('/product-by-categoryies',productController.getProductByCategories)

userRoute.post('/add-whishlist',userAuthentication,productController.addToWishlist)

userRoute.post('/remove-whishlist',userAuthentication,productController.removeFromWishlist)

userRoute.get('/whishlist',userAuthentication,productController.getWishlist)

userRoute.get('/product-details/:id',productController.getProductDetails)

module.exports=userRoute
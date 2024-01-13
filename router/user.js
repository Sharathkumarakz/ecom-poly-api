const express = require("express");
const userRoute = express();

/**
 * Controllers
 */
const authController = require('../controllers/user/authController');
const { userAuthentication } = require("../middleware/authentication");


userRoute.post('/register',authController.register)

userRoute.post('/login',authController.login)

userRoute.post('/resend-otp',authController.resendOtp)

userRoute.post('/otp-verification',authController.verifyOtp)

userRoute.get('/user/get-user-details',userAuthentication,authController.getUserDetails)

module.exports=userRoute
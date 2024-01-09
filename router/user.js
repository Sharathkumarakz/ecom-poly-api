const express = require("express");
const userRoute = express();

/**
 * Controllers
 */
const authController = require('../controllers/user/authController');


userRoute.post('/register',authController.register)

userRoute.post('/login',authController.login)

userRoute.post('/resend-otp',authController.resendOtp)

userRoute.post('/otp-verification',authController.verifyOtp)


module.exports=userRoute
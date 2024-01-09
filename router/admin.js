const express = require("express");
const adminRoute = express();

/**
 * Controllers
 */
const authController = require('../controllers/admin/authController')

adminRoute.post('/login',authController.login)

adminRoute.post('/register',authController.register)




module.exports = adminRoute
const express = require("express");
const suAdminRoute = express();

const authController = require('../controllers/suadmin/authController')

suAdminRoute.post('/login',authController.login)


module.exports = suAdminRoute;
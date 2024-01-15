const express = require("express");
const suAdminRoute = express();

const authController = require('../controllers/suadmin/authController')
const adminController = require('../controllers/suadmin/adminController');

//auth
const { superAdminAuthentication } = require("../middleware/authentication");

suAdminRoute.post('/login',authController.login)

suAdminRoute.get('/admin-requests',superAdminAuthentication,adminController.requests);

suAdminRoute.get('/verify-admin/:id',superAdminAuthentication,adminController.verifyAdmin);

suAdminRoute.get('/admins',superAdminAuthentication,adminController.allAdmins);

suAdminRoute.get('/admin-unBlock/:id',superAdminAuthentication,adminController.unBlockAdmin);

suAdminRoute.get('/admin-block/:id',superAdminAuthentication,adminController.blockAdmin);

suAdminRoute.post('/add-category',superAdminAuthentication,adminController.addCategory);

suAdminRoute.post('/add-main-category',superAdminAuthentication,adminController.addMainCategory);

suAdminRoute.get('/delete-category/:id',superAdminAuthentication,adminController.deleteCategory);

suAdminRoute.get('/delete-product/:id',superAdminAuthentication,adminController.deleteProduct);

suAdminRoute.get('/delete-main-category/:id',superAdminAuthentication,adminController.deleteMainCategory);

suAdminRoute.post('/categories',adminController.getCategories);

suAdminRoute.get('/main-categories',superAdminAuthentication,adminController.getMainCategories);

suAdminRoute.post('/add-product',superAdminAuthentication,adminController.addProduct);

suAdminRoute.get('/products',adminController.products);

suAdminRoute.get('/orders',superAdminAuthentication,adminController.getOrders);

suAdminRoute.post('/order-status',superAdminAuthentication,adminController.changeStatus);


module.exports = suAdminRoute;
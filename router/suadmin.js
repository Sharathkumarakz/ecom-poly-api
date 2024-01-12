const express = require("express");
const suAdminRoute = express();

const authController = require('../controllers/suadmin/authController')
const adminController = require('../controllers/suadmin/adminController')

suAdminRoute.post('/login',authController.login)

suAdminRoute.get('/admin-requests',adminController.requests);

suAdminRoute.get('/verify-admin/:id',adminController.verifyAdmin);

suAdminRoute.get('/admins',adminController.allAdmins);

suAdminRoute.get('/admin-unBlock/:id',adminController.unBlockAdmin);

suAdminRoute.get('/admin-block/:id',adminController.blockAdmin);

suAdminRoute.post('/add-category',adminController.addCategory);

suAdminRoute.post('/add-main-category',adminController.addMainCategory);

suAdminRoute.get('/delete-category/:id',adminController.deleteCategory);

suAdminRoute.get('/delete-product/:id',adminController.deleteProduct);

suAdminRoute.get('/delete-main-category/:id',adminController.deleteMainCategory);

suAdminRoute.post('/categories',adminController.getCategories);

suAdminRoute.get('/main-categories',adminController.getMainCategories);

suAdminRoute.post('/add-product',adminController.addProduct);

suAdminRoute.get('/products',adminController.products);

module.exports = suAdminRoute;
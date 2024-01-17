const express = require("express");
const adminRoute = express();

/**
 * Controllers
 */
const authController = require('../controllers/admin/authController');
const adminController = require('../controllers/admin/adminActionController');

const { adminAuthentication } = require("../middleware/authentication");



adminRoute.post('/login',authController.login)

adminRoute.post('/register',authController.register)

adminRoute.get('/users',adminAuthentication,adminController.getUsers);

adminRoute.get('/user-unBlock/:id',adminAuthentication,adminController.unBlockUser);

adminRoute.get('/user-block/:id',adminAuthentication,adminController.blockUser);

adminRoute.get('/products',adminController.products);

adminRoute.post('/categories',adminController.getCategories);

adminRoute.get('/main-categories',adminAuthentication,adminController.getMainCategories);

adminRoute.get('/delete-product/:id',adminAuthentication,adminController.deleteProduct);

adminRoute.post('/add-product',adminAuthentication,adminController.addProduct);

adminRoute.post('/add-category',adminAuthentication,adminController.addCategory);

adminRoute.get('/delete-category/:id',adminAuthentication,adminController.deleteCategory);

adminRoute.post('/add-main-category',adminAuthentication,adminController.addMainCategory);

adminRoute.get('/delete-main-category/:id',adminAuthentication,adminController.deleteMainCategory);

adminRoute.get('/orders',adminAuthentication,adminController.getOrders);

adminRoute.post('/order-status',adminAuthentication,adminController.changeStatus);

module.exports = adminRoute
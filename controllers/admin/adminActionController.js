const jwt = require('jsonwebtoken');

const sendEmail = require('../../middleware/nodemailer');

/**
 * Cloudinary
 */
const { uploadToCloudinary, removeFromCloudinary } = require('../../middleware/cloudinary');

/**
 * DB
 */
const Admins = require('../../models/admin');
const Category =  require('../../models/category');
const MainCategory =  require('../../models/main-category');
const Product =  require('../../models/product');
const Order =  require('../../models/order');
const Users =  require('../../models/user');




const getUsers = async (req, res, next) => { 
    try {
    const users = await Users.find({}).sort({date:-1})
     return res.status(200).send({ data:users })
    } catch (error) {
        return res.status(400).send({
            message: "user fetch failed"
        });
    }
}


const unBlockUser = async (req, res, next) => { 
    try {
     const adminId =  req.headers?.adminId;
     const adminDetails = await Admins.findOne({_id:adminId});

     if(!adminDetails.access.includes('user')){
        return res.status(400).send({
            message: "You don't have permission to do this action"
        });
     }
     await Users.updateOne({_id: req.params.id },{$set:{isBlocked:false}})
     return res.status(200).send({ message:'success' })
    } catch (error) {
        return res.status(400).send({
            message: "User unBlock failed"
        });
    }
}

const blockUser = async (req, res, next) => { 
    try {
        const adminId =  req.headers?.adminId;
        const adminDetails = await Admins.findOne({_id:adminId});
   
        if(!adminDetails.access.includes('user')){
           return res.status(400).send({
               message: "You don't have permission to do this action"
           });
        }
     await Users.updateOne({_id: req.params.id },{$set:{isBlocked: true}})
     return res.status(200).send({ message:'success' })
    } catch (error) {
        return res.status(400).send({
            message: "User block failed"
        });
    }
}

const products = async (req, res, next) => { 
    try {
     const categories = await Product.find({}).populate('category').populate('subCategory');
     return res.status(200).send({ data:categories })
    } catch (error) {
        return res.status(400).send({
            message: "Fetch category failed"
        });
    }
}

const getCategories = async (req, res, next) => { 
    try {
     const id = req.body?.id;
     if(id){
        const allCategory = await MainCategory.findOne({_id:id});
        const categories = await Category.find({origin:allCategory.categoryName}); 
        return res.status(200).send({ data:categories })
     }
     const categories = await Category.find({});
     return res.status(200).send({ data:categories })
    } catch (error) {
        return res.status(400).send({
            message: "Fetch category failed"
        });
    }
}


const getMainCategories = async (req, res, next) => { 
    try {
     const categories = await MainCategory.find({});
     return res.status(200).send({ data:categories })
    } catch (error) {
        return res.status(400).send({
            message: "Fetch category failed"
        });
    }
}


const addProduct = async (req, res, next) => { 
    try {
        const adminId =  req.headers?.adminId;
        const adminDetails = await Admins.findOne({_id:adminId});
   
        if(!adminDetails.access.includes('product')){
           return res.status(400).send({
               message: "You don't have permission to do this action"
           });
        }
        const {name,category,subCategory,stock,price,description,brand} = JSON.parse(req.body.textFieldName);
        const photo = req.files.image;
        const image = await uploadToCloudinary(photo.tempFilePath, "products");
        let productData = new Product({
            name: name,
            image:image.url,
            imagePublicId:image.public_id,
            brand:brand,
            description:description,
            price:price,
            stock:stock,
            category:category,
            subCategory:subCategory
        })
        await productData.save()
        let allProducts = await Product.find({}).populate('category').populate('subCategory');
        return res.status(200).json({data:allProducts}) 
        
    } catch (error) {
        return res.status(400).send({
            message: "Fetch products failed"
        });
    }
}


const deleteProduct = async (req, res, next) => { 
    try {
        const adminId =  req.headers?.adminId;
        const adminDetails = await Admins.findOne({_id:adminId});
   
        if(!adminDetails.access.includes('product')){
            return res.status(400).send({
                message: "You don't have permission to do this action"
            });
         }
    await Product.deleteOne({ _id: req.params.id })
    let allProduct = await Product.find({}).populate('category').populate('subCategory');
     return res.status(200).send({ data:allProduct })
    } catch (error) {
        log
        return res.status(400).send({
            message: "Product delete failed"
        });
    }
}



const addCategory = async (req, res, next) => { //user registration
    try {
        const adminId =  req.headers?.adminId;
        const adminDetails = await Admins.findOne({_id:adminId});
   
        if(!adminDetails.access.includes('category')){
            return res.status(400).send({
                message: "You don't have permission to do this action"
            });
         }
        const { category, description , origin } = req.body
        if (!category || !description || !origin) {
            return res.status(400).send({
                message: "Missing Credentials"
            });
        } else {
            let categoryAlreadyExist = await Category.findOne({ categoryName: category })
            if (categoryAlreadyExist && categoryAlreadyExist.origin === origin) {
                return res.status(400).send({
                    message: "category already exist "
                });
            } else {
                let categoryData = new Category({
                    categoryName: category,
                    description: description,
                    origin: origin,
                    date:Date.now()
                })
                await categoryData.save()
                let allCategory = await Category.find({})
                return res.status(200).json({data:allCategory})
            }
        }
    } catch (err) {
        return res.status(400).send({
            message: "add category failed"
        });
    }
}

const deleteCategory = async (req, res, next) => { 
    try {
        const adminId =  req.headers?.adminId;
        const adminDetails = await Admins.findOne({_id:adminId});
   
        if(!adminDetails.access.includes('category')){
            return res.status(400).send({
                message: "You don't have permission to do this action"
            });
         }

        /**
         * 
         * 
         * kjhfahfhjd  prodct checking
         */
    await Category.deleteOne({ _id: req.params.id })
    let allCategory = await Category.find({})
     return res.status(200).send({ data:allCategory })
    } catch (error) {
        return res.status(400).send({
            message: "Delete category failed"
        });
    }
}


const addMainCategory = async (req, res, next) => { //user registration
    try {

        const adminId =  req.headers?.adminId;
        const adminDetails = await Admins.findOne({_id:adminId});
   
        if(!adminDetails.access.includes('category')){
            return res.status(400).send({
                message: "You don't have permission to do this action"
            });
         }


        const { mainCategory, mainDescription } = req.body

        if (!mainCategory || ! mainDescription ) {
            return res.status(400).send({
                message: "Missing Credentials"
            });
        } else {
            let categoryAlreadyExist = await MainCategory.findOne({ categoryName: mainCategory })

            if (categoryAlreadyExist) {
                return res.status(400).send({
                    message: "category already exist "
                });
            } else {
                let categoryData = new MainCategory({
                    categoryName: mainCategory,
                    description: mainDescription,
                    date:Date.now()
                })
                await categoryData.save()
                let allCategory = await MainCategory.find({})
                return res.status(200).json({data:allCategory})
            }
        }
    } catch (err) {
        return res.status(400).send({
            message: "add category failed"
        });
    }
}


const deleteMainCategory = async (req, res, next) => { 
    try {
        const adminId =  req.headers?.adminId;
        const adminDetails = await Admins.findOne({_id:adminId});
   
        if(!adminDetails.access.includes('category')){
            return res.status(400).send({
                message: "You don't have permission to do this action"
            });
         }

        /**
         * category
         * 
         * kjhfahfhjd  prodct checking
         */
    await MainCategory.deleteOne({ _id: req.params.id })
    let allCategory = await MainCategory.find({})
     return res.status(200).send({ data:allCategory })
    } catch (error) {
        return res.status(400).send({
            message: "Delete main category failed"
        });
    }
}

const getOrders = async (req, res, next) => { 
    try {
    const order = await Order.find({}).populate('product.productId').populate('userId').sort({date:-1})
     return res.status(200).send({ data:order })
    } catch (error) {
        return res.status(400).send({
            message: "order fetch failed"
        });
    }
}

const changeStatus = async (req, res, next) => { 
    try {
        const adminId =  req.headers?.adminId;
        const adminDetails = await Admins.findOne({_id:adminId});
   
        if(!adminDetails.access.includes('order')){
            return res.status(400).send({
                message: "You don't have permission to do this action"
            });
         }
    const {orderId , status} = req.body
    const data = await Order.findOne({_id:orderId});
    await Order.updateOne({_id: orderId},{$set:{status:status}})
    if(status === 'Paid' && data.email){
        await Order.deleteOne({_id: orderId}) 
    } 
     return res.status(200).send({ message:'success' })
    } catch (error) {
        return res.status(400).send({
            message: "order fetch failed"
        });
    }
}

module.exports = {
    getUsers,
    unBlockUser,
    blockUser,
    products,
    getCategories,
    getMainCategories,
    addProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addMainCategory,
    deleteMainCategory,
    getOrders,
    changeStatus
}
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

const requests = async (req, res, next) => { 
    try {
     const adminRequests = await Admins.find({verified: false});
     return res.status(200).send({ data:adminRequests })
    } catch (error) {
        return res.status(400).send({
            message: "Admin request fetch failed"
        });
    }
}

const verifyAdmin = async (req, res, next) => { 
    try {
     await Admins.updateOne({_id: req.params.id },{$set:{verified:true}});
     const admin = await Admins.findOne({_id: req.params.id });
     sendEmail(admin.email, "Admin Verification", `Dear ${admin.name} You have verified by InfoTech Admin, Now you can start your journey as Admin`)
     return res.status(200).send({
        message: "Admin request fetch failed"
    });
    } catch (error) {
        return res.status(400).send({
            message: "Admin request fetch failed"
        });
    }
}

const allAdmins = async (req, res, next) => { 
    try {
     const adminRequests = await Admins.find({verified: true});
     return res.status(200).send({ data:adminRequests })
    } catch (error) {
        return res.status(400).send({
            message: "Admin request fetch failed"
        });
    }
}

const unBlockAdmin = async (req, res, next) => { 
    try {
     await Admins.updateOne({_id: req.params.id },{$set:{isBlocked:false}})
     const adminRequests = await Admins.find({verified: true});
     return res.status(200).send({ data:adminRequests })
    } catch (error) {
        return res.status(400).send({
            message: "Admin unBlock failed"
        });
    }
}

const blockAdmin = async (req, res, next) => { 
    try {
     await Admins.updateOne({_id: req.params.id },{$set:{isBlocked: true}})
     const adminRequests = await Admins.find({verified: true});
     return res.status(200).send({ data:adminRequests })
    } catch (error) {
        return res.status(400).send({
            message: "Admin block failed"
        });
    }
}

const addCategory = async (req, res, next) => { //user registration
    try {
        console.log(req.body,"qweqe");
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
        console.log(err);
        return res.status(400).send({
            message: "add category failed"
        });
    }
}



const addMainCategory = async (req, res, next) => { //user registration
    try {
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
        console.log(err);
        return res.status(400).send({
            message: "add category failed"
        });
    }
}


const deleteCategory = async (req, res, next) => { 
    try {

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


const deleteMainCategory = async (req, res, next) => { 
    try {

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

const getCategories = async (req, res, next) => { 
    try {
        console.log(req.body);
     const id = req.body?.id;
     if(id){
        const allCategory = await MainCategory.findOne({_id:id});
        console.log(allCategory.categoryName);
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
        console.log(error);
        return res.status(400).send({
            message: "Fetch products failed"
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


const deleteProduct = async (req, res, next) => { 
    try {
    await Product.deleteOne({ _id: req.params.id })
    let allProduct = await Product.find({}).populate('category').populate('subCategory');
     return res.status(200).send({ data:allProduct })
    } catch (error) {
        return res.status(400).send({
            message: "Product delete failed"
        });
    }
}


module.exports = {
    requests,
    verifyAdmin,
    allAdmins,
    unBlockAdmin,
    blockAdmin,
    addCategory,
    deleteCategory,
    getCategories,
    addMainCategory,
    getMainCategories,
    deleteMainCategory,
    addProduct,
    products,
    deleteProduct
}
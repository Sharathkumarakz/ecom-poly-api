
/**
 * Database
 */
const User = require('../../models/user');
const Categories = require('../../models/main-category');
const Product = require('../../models/product');


 const categories = async (req,res,next)=>{
    try {
        const categories = await Categories.find({});
        return res.status(200).send({ data:categories });
    } catch (error) {
        return res.status(400).send({
            message: "Category fetch faild"
        });
    }
 }

 const getProductByMainCategory = async (req,res,next)=>{
    try {
        const id = req.body.id
        console.log(id,"cataegory id");
        const products = await Product.find({category:id});
        return res.status(200).send({ data:products });
    } catch (error) {
        return res.status(400).send({
            message: "Product fetch faild"
        });
    }
 }


 const getProductByCategories = async (req,res,next)=>{
    try {
        const cat1 = req.body.mainCat;
        const cat2 = req.body.subCat;
        const products = await Product.find({category:cat1,subCategory:cat2});
        return res.status(200).send({ data:products });
    } catch (error) {
        return res.status(400).send({
            message: "Product fetch faild"
        });
    }
 }

 const addToWishlist = async (req,res,next)=>{
    try {
        const claim = req.headers?.userId;
        const id = req.body.id;
        const found = await User.findOne({ _id: claim, "wishlist.product": id })
        if (found) {
            res.status(200).send({exist:true})
        } else {
          await User.updateOne({ _id: claim }, { $push: { wishlist: { product: id } } })
          res.status(200).send({success:true})
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Add to wishlist faild"
        });
    }
 }

 const getWishlist = async (req,res,next)=>{
    try {
        const claim = req.headers?.userId;
        const wishlistData = await User.findOne({ _id:claim }).populate('wishlist.product');
        return res.status(200).send({ data:wishlistData });
    } catch (error) {
        return res.status(400).send({
            message: "Product fetch (wishlist) faild"
        });
    }
 }

 const removeFromWishlist = async (req,res,next)=>{
    try {
        const claim = req.headers?.userId;
        const id = req.body.id;
        await User.updateOne({ _id:claim }, { $pull: { wishlist: { product: id } } })
        const wishlistData = await User.findOne({ _id:claim }).populate('wishlist.product');
        return res.status(200).send({ data:wishlistData });
        }catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Remove from wishlist faild"
        });
    }
 }

 const getProductDetails = async (req,res,next)=>{
    try {
        const id = req.params.id
        const products = await Product.find({_id:id}).populate('category').populate('subCategory');
        return res.status(200).send({ data:products });
        }catch (error) {
        return res.status(400).send({
            message: "product fetch failed"
        });
    }
 }

module.exports = {
    categories,
    getProductByMainCategory,
    getProductByCategories,
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    getProductDetails
}
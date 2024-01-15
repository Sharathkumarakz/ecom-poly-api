
/**
 * Database
 */
const User = require('../../models/user');
const Categories = require('../../models/main-category');
const Product = require('../../models/product');


 const addToCart = async (req,res,next)=>{
   try {
    const id = req.body.id
    const claim = req.headers?.userId;
    const prodetails = await Product.findOne({ _id: id });
    if(prodetails.stock<=0){
        return res.status(401).send({
            message: "Out of stock"
        });
     }
     const found = await User.findOne({ _id: claim, "cart.product": id })
      if (found) {
        await User.updateOne({ _id: claim }, { $pull: { wishlist: { product: id } } })
        res.status(200).send({exist:true})
      } else { 
        await User.updateOne({ _id: claim }, { $push: { cart: { product: id, quantity: 1, productTotalPrice: prodetails.price } } })
        await User.findOne({ _id: claim }).populate('cart.product');
        await User.updateOne({ u_id: claim}, { $pull: { wishlist: { product: id } } })
        res.status(200).send({success:true})
    }
  } catch (error) {
    return res.status(400).send({
        message: "Add to Cart faild"
    });
 }
} 

const getCart = async (req,res,next) => {
    try {
      const claim = req.headers?.userId;
      const cart = await User.findOne({ _id: claim }).populate('cart.product').exec()
      let cartTotal = 0;
      for (let i = 0; i < cart.cart.length; i++) {

        cartTotal += cart.cart[i].productTotalPrice;

      }

     await User.updateOne({_id: claim }, { $set: { cartTotalPrice: cartTotal }})

     return res.status(200).send({ data:cart });
    } catch (error) {
        return res.status(400).send({
            message: "get cart failed"
        });
    }
}

const qantityChange = async (req,res,next) => {
    try {
        const claim = req.headers?.userId;
        const prodId = req.body.product
        const productdetails = await Product.findOne({ _id: prodId })
        const count = req.body.count;
        const user = await User.findOne({ _id:claim})
        const inc = await User.updateOne({ _id: claim, "cart.product": prodId }, {
          $inc: { 'cart.$.quantity': count }
        })
        const cartqty = await User.findOne({_id: user._id, "cart.product": prodId},{"cart.quantity.$":1,_id:0})    
        const qqq = cartqty.cart[0].quantity;
        const qty = (await Product.findOne({_id: prodId},{_id:0,stock:1})).stock
  
        const qnty = await User.findOne({ _id: claim, "cart.product": prodId }, { "cart.$": 1 })
        const productprice = productdetails.price * qnty.cart[0].quantity
        await User.updateOne({ _id: user._id, "cart.product": prodId }, {
          $set: { 'cart.$.productTotalPrice': productprice }
  
        })
        const cart = await User.findOne({ _id:claim }).populate('cart.product').exec()
        let cartTotal = 0;
        for (let i = 0; i < cart.cart.length; i++) {
  
          cartTotal += cart.cart[i].productTotalPrice;
        }
        const add = await User.updateOne({ _id:claim }, {
          $set: { cartTotalPrice: cartTotal }
        })
    const cartDetails = await User.findOne({ _id: claim }).populate('cart.product').exec()
     return res.status(200).send({ data:cartDetails });
    } catch (error) {
        return res.status(400).send({
            message: "Cart quantity change failed"
        });
    }
}

const removeFromCart = async (req, res, next) => {
  try {
      const id = req.params.id
      const claim = req.headers?.userId;
      let resd = await User.updateOne({ _id: claim }, { $pull: { cart: { product: id } } });
      
      res.status(200).send({success:true})
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Remove from cart failed"
  });
  }
}


module.exports = {
    addToCart,
    getCart,
    qantityChange,
    removeFromCart
}
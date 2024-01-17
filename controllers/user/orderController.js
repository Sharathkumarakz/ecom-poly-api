
/**
 * Database
 */
const User = require('../../models/user');
const Categories = require('../../models/main-category');
const Product = require('../../models/product');
const Order = require('../../models/order');


const { v4: uuidv4 } = require('uuid');

const makeOrder = async (req, res, next) => {
  try {
    const claim = req.headers?.userId;
    const address = req.body.address;
    const cart = await User.findOne({ _id:claim }).populate('cart.product').exec();
    let productIds = [];
    let singlePrices = [];
    let quantitys = [];
    let singleTotals = [];
    let count = 0;
    cart.cart.forEach(element => {
        productIds.push(element.product._id);
        singlePrices.push(element.product.price);
        singleTotals.push(element.productTotalPrice);
        quantitys.push(element.quantity);
        count += 1;
    });
    const orders = req.body
    const orderDetails = [];
    orders.product = orderDetails;
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i]
      const quantity = quantitys[i]
      const singleTotal = singleTotals[i]
      const singlePrice = singlePrices[i]
      orderDetails.push({ productId: productId, quantity: quantity, singleTotal: singleTotal,singlePrice:singlePrice })
    }
    const ordersave = new Order({
      userId: claim,
      product: orderDetails,
      total:cart.cartTotalPrice,
      orderId:`order_id_${uuidv4()}`, 
      deliveryAddress: address,
      paymentType: 'COD',
      date:Date.now(),
    })
    await ordersave.save()
    await User.updateOne({ _id: claim }, {
        $set: {
          cart:[]
        }
      }) 
      const add = await User.updateOne({ _id: claim }, {
        $set: { cartTotalPrice: 0 }
      })
    return res.status(200).send({
        message: "Order placed"
    });
  } catch (error) {
    return res.status(400).send({
      message: "Order failed"
  });
  }
}

const getOrders = async (req, res, next) => {
  try {
    const claim = req.headers?.userId;
    const order = await Order.find({ userId: claim }).populate('product.productId').sort({date:-1})
    return res.status(200).send({ data:order });
  } catch (error) {
    return res.status(400).send({
      message: "Order fetch failed"
   });
  }
}


module.exports = {
    makeOrder,
    getOrders
}
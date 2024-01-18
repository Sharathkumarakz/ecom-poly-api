const mongoose = require('mongoose');


const orderData = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    
  },
  product: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity:{
          type:Number,
          required:true,
      } ,
      singleTotal:{
        type:Number,
        required:true
    },singlePrice:{
      type:Number,
      required:true
    }
  }
  ],
  total: {
    type: Number,
  },
  paymentType: {
    type: String,
    required:true,
  },
  isTrust:{
    type:Boolean,
    default:true
  },
  phone:{
    type:Number
  },
  email:{
    type:String
  },
  trackCode:{
    type:Number
  },
   status:{
    type:String,
    default:"confirmed"
   },
   deliveryDate:{
    type: Date,
   },
   returnDate:{
    type: Date,
   },
   returnReason:{
    type:String,
   }
});

module.exports = mongoose.model('Order', orderData);
 
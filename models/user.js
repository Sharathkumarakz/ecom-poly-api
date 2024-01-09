const mongoose = require('mongoose');


const userData = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isBlocked: {
    type: Boolean,
    required: false
  },
  phone: {
    type: Number,
    required: true
  },
  otp: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  verified: {
    type: Boolean,
    required: true
  },
  status: {
    type: Number,
    default: true
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1
    },
    productTotalPrice: {
      type: Number,
      required: true,
    },
  }],
  cartTotalPrice: {
    type: Number,

  },
  wallet:{
   type:Number,
  },
  address: [
    {
      houseName: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      district: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      phone: {
        type: Number,
        required: true
      }
    }
  ],

  wishlist: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }
  }]
});
module.exports = mongoose.model('User', userData);
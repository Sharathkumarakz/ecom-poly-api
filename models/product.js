const mongoose=require("mongoose");

const productData = new mongoose.Schema({
      name:{
        type:String,
        required:true
      },
      image:{
        type:String,
        required:true
      },
      category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "MainCategory",
        required: true  ,
      },
      subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true  ,
      },
      stock:{
        type:Number,
        required:true,
       
      },
      price:{
        type:Number,
        required:true
      },
      description:{
        type:String,
        required:true
      },
      brand:{
        type:String,
        required:true
      },
      imagePublicId:{
        type:String,
        default:true
      },
      status:{
       type:Number,
       default:true
      }
});
module.exports=mongoose.model('Product',productData);
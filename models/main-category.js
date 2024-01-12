const mongoose=require("mongoose");

const mainCategoryData = new mongoose.Schema({
      categoryName:{
        type:String,
        required:true
      },
      description:{
        type:String,
        required:true
      },
      date:{
        type:Date,
        required:true,
        default:Date.now()
      },
});
module.exports=mongoose.model('MainCategory',mainCategoryData);
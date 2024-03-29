const mongoose=require("mongoose");

const adminData = new mongoose.Schema({
      name:{
        type:String,
        required:true
      },
      image:{
        type:String,
        required:true
      },
      email:{
        type:String,
        required: true,
      },
      phone:{
        type:Number,
        required:true,   
      },
      access: {
        type: [String],
      },
      isApproved:{
        type:Boolean,
        required:false,
      },
      document:{
        type:String,
        required:true
      },
      password:{
        type:String,
        required:true
      },
      place:{
        type:String,
        required:true
      },
      verified:{
        type:Boolean,
        required:true
      },
      state:{
        type:String,
        required:true
      },
      isBlocked:{
       type:Boolean,
       default:false
      },
      docPublicId:{
        type:String,
        required:true
      },
      photoPublicId:{
        type:String,
        required:true
      }
});
module.exports=mongoose.model('Admin',adminData);
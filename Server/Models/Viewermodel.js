const mongoose=require('mongoose');

const ViewerSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

const ViewerModel=mongoose.model('Viewer',ViewerSchema);
module.exports=ViewerModel;
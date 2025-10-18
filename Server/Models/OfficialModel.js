const mongoose=require('mongoose');

const OfficialSchema=mongoose.Schema({
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
},
{
    timestamps:true
});

const OfficialModel=mongoose.model('Official',OfficialSchema);
module.exports=OfficialModel;
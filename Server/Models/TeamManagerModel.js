const mongoose=require('mongoose');


const TeamManagerSchema=mongoose.Schema({
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
    },
    team_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
    }
},
{
    timestamps:true
});

const TeamManagerModel=mongoose.model('TeamManager',TeamManagerSchema);
module.exports=TeamManagerModel;
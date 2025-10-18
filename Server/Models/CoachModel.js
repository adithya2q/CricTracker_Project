const mongoose=require('mongoose');

const CoachSchema=mongoose.Schema({
    coach_name:{
        type:String,
        required:true
    },
    coach_team:{
        type:Schema.Types.ObjectId,
        ref:'Team',
        required:true
    },
    coach_age:{
        type:Number,
        required:true
    },
    coach_role:{
        type:String,
        required:true
    },
    coach_price:{
        type:Number,
        required:true
    },
    coach_image:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

const CoachModel=mongoose.model('Coach',CoachSchema);
module.exports=CoachModel
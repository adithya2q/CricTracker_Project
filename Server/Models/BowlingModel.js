const mongoose=require('mongoose');

const BowlingSchema=mongoose.Schema({
    innings_id:{
        type:Schema.Types.ObjectId,
        ref:'Innings',
        required:true
    },
    Bowler_id:{
        type:Schema.Types.ObjectId,
        ref:'Player',
        required:true
    },
    Runs:{
        type:Number,
        default:0
    },
    Wickets:{
        type:Number,
        default:0
    },
    Overs:{
        type:Number,
        default:0
    },
    Maidens:{
        type:Number,
        default:0
    },
    EconomyRate:{
        type:Number,
        default:0
    }
},
{timestamps:true}
);

const BowlingModel=mongoose.model('BowlingScore',BowlingSchema);
module.exports=BowlingModel
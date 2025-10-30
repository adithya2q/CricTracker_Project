const mongoose=require('mongoose');

const BattingSchema=mongoose.Schema({
    innings_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Innings',
        required:true
    },
    player_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Player',
        required:true
    },
    Runs:{
        type:Number,
        default:0
    },
    Balls:{
        type:Number,
        default:0
    },
    Fours:{
        type:Number,
        default:0
    },
    Sixes:{
        type:Number,
        default:0
    },
    StrikeRate:{
        type:Number,
        default:0
    },
    Batting_status:{
        type:String,
        enum:['not_out','out','not_batted'],
        default:'not_batted'
    },
    Dismissal:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dismissal',
    }
},
{
    timestamps:true
})

const BattingModel=mongoose.model('BattingScore',BattingSchema);
module.exports=BattingModel;
const mongoose=require('mongoose');
const DismissalSchema = require('./DismissalModel');
const ExtrasSchema = require('./ExtrasSchema');

const BowlingSchema=mongoose.Schema({
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
    Wickets:{
        type:Number,
        default:0
    },
    Overs:{
        type:Number,
        default:0
    },
    Balls:{
        type:Number,
        default:0
    },
    runs_this_over: {
        type: Number,
        default: 0
    },
    Maidens:{
        type:Number,
        default:0
    },
    EconomyRate:{
        type:Number,
        default:0
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    Extras:{
        type:ExtrasSchema,
        default:()=>({})
    },
    bowling_status:{
        type:String,
        enum:['bowled','not_bowled','active'],
    },
    Dismissal:[{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dismissal',}]
},
{timestamps:true}
);

const BowlingModel=mongoose.model('BowlingScore',BowlingSchema);
module.exports=BowlingModel
const mongoose=require('mongoose');

const PlayerMatchSummarySchema=mongoose.Schema({
    player_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Player',
        required:true
    },
    match_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Match',
        required:true
    },
    innings_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Innings',
        required:true
    },
    opponent_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
    },
    format:{
        type:String,
        enum:['T20I','ODI','Test',"Domestic_T20", "Domestic_ODI", "Domestic_Test"],
        required:true
    },
    match_date:{
        type:String,
    },
    is_innings_played:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    batting:{
        runs:{
            type:Number,
            default:0
        },
        balls:{
            type:Number,
            default:0
        },
        fours:{
            type:Number,
            default:0
        },
        sixes:{
            type:Number,
            default:0
        },
        dismissal_against:{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:'Dismissal'
        },
        batting_status:{
            type:String,
            enum:['not_out','out','not_batted'],
            default:'not_batted'
        },
        bowlers_faced:[
            {
                bowler_id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Player'
                },
                balls_bowled:{
                    type:Number,
                    default:0
                },
                runs_conceded:{
                    type:Number,
                    default:0
                },
                is_dismissed:{
                    type:Boolean,
                    default:false
                }
            }
        ]
    },
    bowling:{
        wickets: {
            type: Number,
            default: 0
        },
        overs: {
            type: Number,
            default: 0
        },
        balls_bowled: {
            type: Number,
            default: 0
        },
        runs_conceded: {
            type: Number,
            default: 0
        },
        maidens:{
            type:Number,
            default:0
        },
        dismissals:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Dismissal'
        }]  
    },
    fielding:{
        catches:{
            type:Number,
            default:0
        },
        stumpings:{
            type:Number,
            default:0
        },
        run_outs:{
            type:Number,
            default:0
        }
    }
},
{
    timestamps:true
})

const PlayerMatchSummaryModel=mongoose.model('PlayerMatchSummary',PlayerMatchSummarySchema);
module.exports=PlayerMatchSummaryModel
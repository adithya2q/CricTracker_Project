const mongoose=require('mongoose');
const DismissalSchema = require('./DismissalModel');


const StatisticsSchema=mongoose.Schema({
        matches_played:{
            type:Number,
            default:0
        },
        Innings_played:{
            type:Number,
            default:0
        },    
         runs:{
            type:Number,
            default:0
        },
        wickets:{
            type:Number,
            default:0
        },
        balls_faced:{
            type:Number,
            default:0
        },
        highest_score:{
            type:Number,
            default:0
        },
        batting_average:{
            type:Number,
            default:0
        },
        strike_rate:{
            type:Number,
            default:0
        },
        runs_given:{
            type:Number,
            default:0
        },
        balls_bowled:{
            type:Number,
            default:0
        },
        overs_bowled:{
            type:Number,
            default:0
        },
        economy_rate:{
            type:Number,
            default:0
        },
        bowling_average:{
            type:Number,
            default:0
        },
    best_bowling_figures: {
        wickets: {
            type: Number,
            default: 0
            },
        runs: {
            type: Number,
            default: 0
            }
        },
        five_wickets:{
            type:Number,
            default:0
        },
        ten_wickets:{
            type:Number,
            default:0
        },
        centuries:{
            type:Number,
            default:0
        },
        fifties:{
            type:Number,
            default:0
        },
        double_centuries:{
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
        catches:{
            type:Number,
            default:0
        },
        run_outs:{
            type:Number,
            default:0
        },
        stumpings:{
            type:Number,
            default:0
        },
        not_outs:{
            type:Number,
            default:0
        }
})

const PlayerSchema=mongoose.Schema({
    player_name:{
        type:String,
        required:true
    },
    player_DOB:{
        type:Date,
        required:true
    },
    player_age:{
        type:Number,
        required:true
    },
    player_role:{
        type:String,
        required:true
    },
    player_batting_style:{
        type:String,
        required:true
    },
    player_bowling_style:{
        type:String,
        required:true
    },
    player_teams:[{
        type:Schema.Types.ObjectId,
        ref:'Team',
        required:true
    }],
    special_status:{
        type:String,
        enum:['Captain','ViceCaptain'],
    },
    special_team_status:{
        type:String,
        enum:['Others','None']
    },
    player_image:{
        type:String,
        required:true
    },
    player_statistics:{
        T20I:StatisticsSchema,
        ODI:StatisticsSchema,
        Test:StatisticsSchema,
        Domestic_T20:StatisticsSchema,
        Domestic_ODI:StatisticsSchema,
        Domestic_Test:StatisticsSchema
    }
       
},
{
    timestamps:true
})

const PlayerModel=mongoose.model('Player',PlayerSchema);
module.exports=PlayerModel;


const mongoose=require('mongoose');

const PlayerSchema=mongoose.Schema({
    player_name:{
        type:String,
        required:true
    },
    player_team:{
        type:Schema.Types.ObjectId,
        ref:'Team',
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
    player_price:{
        type:Number,
        required:true
    },
    player_image:{
        type:String,
        required:true
    },
    statistics:{
        runs_scored:{
            type:Number,
            required:true
        },
        wickets_taken:{
            type:Number,
            required:true
        },
        matches_played:{
            type:Number,
            required:true
        },
        highest_score:{
            type:Number,
            required:true
        }
    }
},
{
    timestamps:true
})

const PlayerModel=mongoose.model('Player',PlayerSchema);
module.exports=PlayerModel;


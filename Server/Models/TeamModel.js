const mongoose=require('mongoose');

const TeamSchema=mongoose.Schema({
    team_name:{
        type:String,
        required:true
    },
    team_logo:{
        type:String,
        required:true
    },
    team_captain:{
        type:Schema.Types.ObjectId,
        ref:'Player',
        required:true
    },
    team_manager:{
        type:Schema.Types.ObjectId,
        ref:'TeamManager',
        required:true
    },
    team_players:[{
        type:Schema.Types.ObjectId,
        ref:'Player',
        required:true
    }],
    team_home:{
        type:Schema.Types.ObjectId,
        ref:'Venue',
        required:true
    },
    team_description:{
        type:String,
        required:true
    },
    team_trophies_won:{
        type:Number,
        default:0
    }
})

const TeamModel=mongoose.model('Team',TeamSchema);
module.exports=TeamModel;
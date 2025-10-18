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
    team_coach:{
        type:Schema.Types.ObjectId,
        ref:'Coach',
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
    }
})

const TeamModel=mongoose.model('Team',TeamSchema);
module.exports=TeamModel;
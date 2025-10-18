const mongoose=require('mongoose');

const TournamentSchema=mongoose.Schema({
    tournament_name:{
        type:String,
        required:true
    },
    tournament_type:{
        type:String,
        enum:['T20','ODI','Test','T10'],
        required:true
    },
    tournament_teams:[{
        type:Schema.Types.ObjectId,
        ref:'Team',
        required:true
    }],
    tournament_matches:[{
        type:Schema.Types.ObjectId,
        ref:'Match',
        required:true
    }],
    tournament_venue:[{
        type:String,

    }],
},{
    timeStamps:true

});

const TournamentModel=mongoose.model('Tournament',TournamentSchema);
module.exports=TournamentModel;
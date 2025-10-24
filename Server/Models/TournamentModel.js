const mongoose=require('mongoose');


const PointsTableSchema=mongoose.Schema({
    team_id:{
        type:Schema.Types.ObjectId,
        ref:'Team',
        required:true
    },
    matches_played:{
        type:Number,
        default:0
    },
    wins:{
        type:Number,
        default:0
    },
    losses:{
        type:Number,
        default:0
    },
    draws:{
        type:Number,
        default:0
    },
    points:{
        type:Number,
        default:0
    },
    net_run_rate:{
        type:Number,
        default:0
    }
});

const TournamentSchema=mongoose.Schema({
    name:{
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
    tournament_venues:[{
        type:String,

    }],
    tournament_status:{
        type:String,
        enum:['live','completed','upcoming','cancelled'],
        default:'upcoming'
    },
    tournament_start_date:{
        type:Date,
        required:true
    },
    tournament_end_date:{
        type:Date,
        required:true
    },
    tournament_image:{
        type:String
    },
    points_table:[PointsTableSchema],
},{
    timeStamps:true

});

const TournamentModel=mongoose.model('Tournament',TournamentSchema);
module.exports=TournamentModel;
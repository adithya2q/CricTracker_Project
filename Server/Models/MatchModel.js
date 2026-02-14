const mongoose=require('mongoose');

const MatchSchema=mongoose.Schema({
    team1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
    },
    team2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
    },
    playingXI_team1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playing11',
    },
    playingXI_team2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playing11',
     },
    match_type:{    
        type:String,
        enum:['T20I','ODI','TestI','Domestic_T20', 'Domestic_OD', 'Domestic_Test'],
        required:true
    },
    match_category: {
        type: String,
        enum: ['tournament', 'friendly'],
        required: true
    },
    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: function() {
        return this.match_category === 'tournament';
        }
    },
    venue:{
        type:String,
        required:true
    },
    match_date:{
        type:String,
    },
    match_status:{
        type:String,
        enum:['live','completed','upcoming','cancelled'],
        default:'upcoming'
    },
    tossWinner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    tossDecision:{
        type:String,
        enum:['bat','field'],
    },
    battingFirstTeam:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Playing11'
    },
    bowlingFirstTeam:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Playing11'
    },
    matchWinner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    result:String,
    commentary:[{
        over:{type:Number},
        commentary:{type:String},
        runs:{type:Number}
    }],
    isScorecardComplete:{
        type:Boolean,
        default:false
    },
    chat:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Viewer',
        },
        message:{
            type:String
        }
    },
    innings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Innings',
    }],
    InningsNumber:{
        type:Number,
        default:1
    },
    currentInnings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Innings',
        default: null
},
isDeleted:{
    type:Boolean,
    default:false
}

},{
    timestamps:true
})

const MatchModel=mongoose.model('Match',MatchSchema);
module.exports=MatchModel

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
        required: true
    },
    playingXI_team2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playing11',
        required: true
     },
    match_type:{    
        type:String,
        enum:['T20I','ODI','Test','Domestic'],
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
    date:{
        type:Date,
        required:true
    },
    status:{
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
    BattingFirstTeam:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    BowlingFirstTeam:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    matchWinner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    result:String,
    Commentary:{
        type:[String],
        default:[]
    },
    Chat:{
        type:[String],
        default:[]
    },
    innings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Innings',
        required:true
    }],
    InningsNumber:{
        type:Number,
        default:1
    },
    currentInnings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inning',
        default: null
},

},{
    timestamps:true
})

const MatchModel=mongoose.model('Match',MatchSchema);
module.exports=MatchModel

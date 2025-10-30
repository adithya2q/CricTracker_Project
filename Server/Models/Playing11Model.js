const mongoose=require('mongoose');
const { applyTimestamps } = require('./DismissalModel');

const Playing11Schema=mongoose.Schema({
    team_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
    },
    match_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Match',
        unique:true    
    },
    players:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Player',
        required:true
    }],
    captain: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Player'
    },
    wicketKeeper: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player' 
    }, 
},{
    timestamps:true
});

const Playing11Model=mongoose.model('Playing11',Playing11Schema);
module.exports=Playing11Model;
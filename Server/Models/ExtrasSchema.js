const mongoose=require('mongoose');

const ExtrasSchema=new mongoose.Schema({
    total:{
        type:Number,
        default:0
    },
    byes:{
        type:Number,
        default:0
    },
    legbyes:{
        type:Number,
        default:0
    },
    wides:{
        type:Number,
        default:0
    },
    noballs:{
        type:Number,
        default:0
    },
    penalty:{
        type:Number,
        default:0
    }
},
{
    _id:false
});

module.exports=ExtrasSchema;
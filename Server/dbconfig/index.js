const mongoose=require('mongoose')
MONGODB_URI_STRING=process.env.MONGODB_URI_STRING;



mongoose.connect(MONGODB_URI_STRING)
.then(()=>{
    console.log("CricTracker database connected successfully")
})
.catch((error)=>{
    console.log("Error connecting to Mongodb",error)
})
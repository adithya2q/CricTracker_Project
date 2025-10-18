const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


dbconfig=require('./dbconfig/index.js');
const router=require('./routes.js');

app.use('',router);

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});
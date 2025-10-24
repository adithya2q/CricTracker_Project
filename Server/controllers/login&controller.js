const ViewerModel = require("../Models/ViewerModel");
const AdminModel = require("../Models/AdminModel");
const TeamManagerModel = require("../Models/TeamManagerModel");
const ScorerModel = require("../Models/ScorerModel");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const rolemodels={
    admin:AdminModel,
    viewer:ViewerModel,
    teamManager:TeamManagerModel,
    scorer:ScorerModel
}


module.exports={
    login:async(req,res)=>{
        try{
            const {email,password,role}=req.body;
            if(!email || !password || !role){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Please enter email, password and role"

                });
            }
            const Models=rolemodels[role];
            const userFound=await Models.findOne({email:email}).lean();
                if(!userFound){
                    return res.status(400).json({
                        success:false,
                        status:400,
                        message:`${role} not found`
                    });
                }
                const isMatch=await bcrypt.compare(password,userFound.password);
                if(!isMatch){
                    return res.status(401).json({
                        success:false,
                        status:401,
                        message:"Invalid credentials"
                    });    
                }
                delete userFound.password;
                const token=jwt.sign({id:userFound._id,role:role},process.env.JWT_SECRET);
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"User logged in successfully",
                    data:userFound,
                    token:token
                }) 
        }       
     catch(error){   
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal server error",
            error:error.message
        });
    }
    },
    UserRegister:async(req,res)=>{
        try{
            const {name,phone,email,password,confirmPassword,role}=req.body;

            // checking for n any missing fields
            if(!name || !email || !phone || !password || !confirmPassword || !role){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"All fields are required"
                });
            } ;
            const Models=rolemodels[role];
           const existingUser=await Models.findOne({email:email}).lean();
            // checking for existing user
            if(existingUser){
                return res.status(409).json({
                    success:false,
                    status:409,
                    message:`User already exists for ${role}`
                });
            }

            // check for password mismatch
            if(password!==confirmPassword){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Password and confirm password do not match"
                });
            }
            
            const encryptedPassword=await bcrypt.hash(password,10);
            const newUser=new Models({name,email,phone,password:encryptedPassword});
            await newUser.save();
            return res.status(201).json({
                success:true,
                status:201,
                message:"User registered successfully",
                data:newUser
            });

        }
        catch(error){
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })
        }
    }
}
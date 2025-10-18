const UserModel = require("../Models/UserModel");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

module.exports={
    login:async(req,res)=>{
        try{
            const {email,password}=req.body;
            if(!email || !password){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Please enter email and password"

                });
            }
            if (role==='user'){
                const userFound=await UserModel.findOne({email:email});
                if(!userFound){
                    return res.status(400).json({
                        success:false,
                        status:400,
                        message:"User not found"
                    });
                }
                const isMatch=await bcrypt.compare(password,user.password);
                if(!isMatch){
                    return res.status(401).json({
                        success:false,
                        status:401,
                        message:"Invalid credentials"
                    });    
                }
                delete user.password;
                const token=jwt.sign({id:userFound._id,role:'user'},process.env.JWT_SECRET);
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"User logged in successfully",
                    data:userFound,
                    token:token
                }) 
            }   
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
            const {name,phone,email,password,confirmPassword}=req.body;

            // checking for nay missing fields
            if(!name || !email || !phone || !password || !confirmPassword){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"All fields are required"
                });
            } ;
            const existingUser=await UserModel.findOne({email:email}).lean();

            // checking for existing user
            if(existingUser){
                return res.status(409).json({
                    success:false,
                    status:409,
                    message:"User already exists"
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
            const newUser=new UserModel({name,email,phone,password:encryptedPassword});
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
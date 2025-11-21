const jwt=require('jsonwebtoken');

module.exports={
    authMiddleware:async(req,res,next)=>{
        try{
            const token=req.header('Authorization')?.replace('Bearer ','');
            if (!token) {
            return res.status(401).json({
              success: false,
              status: 401,
              message: "Authorization token missing",
            });
        }
            const decryptedToken=jwt.verify(token,process.env.JWT_SECRET_KEY);
            if (decryptedToken && decryptedToken.id){
                req.userId=decryptedToken.id;
                req.role=decryptedToken.role;
                next();
            }
        }
        catch(err){
            return res.status(401).json({
                success:false,
                status:401,
                message:"Unauthorized access",
                error:err.message
            });
        
        }
    }
}
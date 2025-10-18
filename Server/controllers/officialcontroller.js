module.exports={
    AddMatch:async (req,res)=>{
        try{
            const {team1:team1_name,team2:team2_name,Match_type,venue,date}=req.body;
            if(!team1 || !team2 || !Match_type || !venue || !date){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"All fields are required"
                });
            }

            const team1=await TeamModel.findOne({team_name:team1_name}).lean();
            const team2=await TeamModel.findOne({team_name:team2_name}).lean();

            if (!team1) {
            return res.status(404).json({
                success:false,
                status:404,
                message: `Team not found: ${team1_name}`
             });
            }
             if (!team2) {
            return res.status(404).json({
                success:false,
                status:404, 
                message: `Team not found: ${team2_name}`
             });
            }
            if (team1._id.equals(team2._id)) {
            return res.status(400).json({
                success:false,
                status:400,
                message: "Teams cannot be the same"
            });
            }
            const match=await MatchModel.create({team1:team1._id,team2:team2._id,Match_type,venue,date,status:'upcoming'});
            return res.status(201).json({
                success:true,
                status:201,
                message:"Match added successfully",
                data:match
            });

        }
        catch(error){
            return res.status(500).json({
                success:false,
                status:500,
                message:"Something went wrong",
                error
            })
        }
    }
}
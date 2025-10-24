const TournamentModel = require("../Models/TournamentModel");

module.exports={
    createMatch:async (req,res)=>{
        
        try{
            const {team1:team1_name,team2:team2_name,Match_type,venue,date,match_category,tournament}=req.body;
            if(!team1 || !team2 || !Match_type || !venue || !date || !match_category){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Teams,match type,match category, venue and date are required"
                });
            }

            if(match_category=='tournament' && !tournament){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Tournament is required"
                });
            }

            const team1=await TeamModel.findOne({team_name:team1_name}).lean();
            const team2=await TeamModel.findOne({team_name:team2_name}).lean();
            const tournament1=await TournamentModel.findOne({_id:tournament.id}).lean();

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
            const match=await MatchModel.create({team1:team1._id,team2:team2._id,Match_type,match_category,tournament:tournament1._id,venue,date,status:'upcoming'});
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
    },
    createTournament:async(req,res)=>{
        try{
            const {tournament_name,tournament_type,tournament_teams,tournament_venues,tournament_matches,tournament_start_date,tournament_end_date,tournament_image}=req.body;
            if(!tournament_name || !tournament_type || !tournament_teams || !tournament_venues || !tournament_matches || !tournament_start_date || !tournament_end_date || !tournament_image){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"All fields are required"
                });
            }
            const tournament=await TournamentModel.create({tournament_name,tournament_type,tournament_teams,tournament_venues,tournament_matches,tournament_start_date,tournament_end_date,tournament_image});
            return res.status(201).json({
                success:true,
                status:201,
                message:"Tournament created successfully",
                data:tournament
            });
        }
        catch(error){
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal Server error",
                error
            })

        }
    }
}
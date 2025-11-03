const Playing11Model = require("../Models/Playing11Model");
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
    },
    updateMatchInfo:async(req,res)=>{
        try{
            const {id}=req.params;
            const updatedFields=req.body;
            const findMatch=await MatchModel.findById(id).populate('team1').populate('team2');
            if(!findMatch){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Match not found"
                });
            }
            if (findMatch.team1.playing11.length!==11){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Team1 playing11 is not complete"
                })
            }
            if(findMatch.team2.playing11.length!==11){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Team2 playing11 is not complete"
                })
            }
            const team1_playing11_register=new Playing11Model({
                team_id:findMatch.team1._id,
                match_id:id,
                captain:findMatch.team1.captain,
                viceCaptain:findMatch.team1.viceCaptain,
                wicketKeeper:findMatch.team1.wicketKeeper,
            });

            team1_playing11_register.players.push(...findMatch.team1.playing11.map(player=>player._id));
            const team2_playing11_register=new Playing11Model({
                team_id:findMatch.team2._id,
                match_id:id,
                captain:findMatch.team2.captain,
                viceCaptain:findMatch.team2.viceCaptain,
                wicketKeeper:findMatch.team2.wicketKeeper,
            })

            team2_playing11_register.players.push(...findMatch.team2.playing11.map(player=>player._id));
            await Promise.all([
                team1_playing11_register.save(),
                team2_playing11_register.save()
             ]);

            const [team1_playing11, team2_playing11] = await Promise.all([
            Playing11Model.findOne({ team_id: findMatch.team1._id })
                .populate('players')
                .populate('team_id'),
            Playing11Model.findOne({ team_id: findMatch.team2._id })
                .populate('players')
                .populate('team_id')
            ]);

            if(!team1_playing11 || !team2_playing11){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Playing11 not found"
                });
            }   

            
            
            if (updatedFields.tossDecision && updatedFields.tossWinner){
                let battingFirstTeam;
                if (updatedFields.tossDecision === 'bat') {
                battingFirstTeam = updatedFields.tossWinner._id.toString()===team1_playing11.team_id._id.toString()?team1_playing11:team2_playing11;
                } else {
                battingFirstTeam = updatedFields.tossWinner._id.toString() === team1_playing11.team_id._id.toString() ? team2_playing11: team1_playing11;
                }
                updatedFields.battingFirstTeam = battingFirstTeam;
                updatedFields.bowlingFirstTeam = battingFirstTeam === team1_playing11 ? team2_playing11 : team1_playing11;

            }
            if(updatedFields.battingFirstTeam && updatedFields.bowlingFirstTeam){
                const firstInnings=new InningsModel({
                battingTeam:updatedFields.battingFirstTeam,
                bowlingTeam:updatedFields.bowlingFirstTeam,
                match_id:id
            })
            await firstInnings.save();
            findMatch.currentInnings=firstInnings._id;
            findMatch.InningsNumber=1;
            await findMatch.save();
            for (const player of battingFirstTeam.players) {
                const firstInnings_batting_scorecard=new BattingScorecardModel({
                    innings:firstInnings._id,
                    player:player._id,
                    batting_status:'not_batted'
                })
                await firstInnings_batting_scorecard.save();
            }
            for (const player of bowlingFirstTeam.players) {
                const firstInnings_bowling_scorecard=new BowlingScorecardModel({
                    innings:firstInnings._id,
                    player:player._id,
                    bowling_status:'not_bowled'
                })
                await firstInnings_bowling_scorecard.save();
            }
            }

            const match=await MatchModel.findByIdAndUpdate(id,{$set:updatedFields},{new:true});
            if(!match){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Match not found"
                });
            }
            return res.status(200).json({
                success:true,
                status:200,
                message:"Match updated successfully",
                data:match
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
const { default: mongoose } = require("mongoose");
const BattingModel = require("../Models/BattingModel");
const BowlingModel = require("../Models/BowlingModel");
const InningsModel = require("../Models/InningsModel");
const MatchModel = require("../Models/MatchModel");
const PlayerModel = require("../Models/PlayerModel");
const Playing11Model = require("../Models/Playing11Model");
const TeamManagerModel = require("../Models/TeamManagerModel");
const TeamModel = require("../Models/TeamModel");
const TournamentModel = require("../Models/TournamentModel");
const { populate } = require("../Models/DismissalModel");
const PlayerMatchSummaryModel = require("../Models/PlayerMatchSumaryModel");

module.exports={
    createMatch:async (req,res)=>{
        try{
            const {team1Id,team2Id,match_type,venue,date,match_category,tournamentId}=req.body;
            if(!team1Id || !team2Id || !match_type || !venue || !date || !match_category){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Teams,match type,match category, venue and date are required"
                });
            }

            if(match_category=='tournament' && !tournamentId){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Tournament is required"
                });
            }

            const team1=await TeamModel.findById(team1Id).lean();
            const team2=await TeamModel.findById(team2Id).lean();
            const tournament1=await TournamentModel.findById(tournamentId);
            
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

            const match=new MatchModel({team1:team1._id,team2:team2._id,match_type,match_category,tournament:tournament1._id,venue,date,status:'upcoming'});
            await match.save();
            tournament1.matches.push(match._id);
            if(tournament1.tournament_status==='upcoming') tournament1.tournament_status='live';
            await tournament1.save();
            return res.status(201).json({
                success:true,
                status:201,
                message:"Match added successfully",
                data:match
            });

        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                status:500,
                message:"Something went wrong",
                error:error.message
            })
        }
    },
    createTournament:async(req,res)=>{
        try{
            const {tournament_name,tournament_type,tournament_teams,tournament_venues,tournament_start_date,tournament_end_date,tournament_image}=req.body;
            if(!tournament_name || !tournament_type || !tournament_teams || !tournament_venues  || !tournament_start_date || !tournament_end_date || !tournament_image){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"All fields are required"
                });
            }
            const tournament=await new TournamentModel({tournament_name,tournament_type,tournament_teams,tournament_venues,tournament_start_date,tournament_end_date,tournament_image});
            const points_table=tournament_teams.map(teamid=>({team_id:teamid,points:0}));
            tournament.points_table=points_table;
            await tournament.save();
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
    registerTeam:async(req,res)=>{
        try {
            const {updatedFields}=req.body;
            const team=await TeamModel.create(updatedFields);
            return res.status(201).json({
                success:true,
                status:201,
                message:"Team registered successfully",
                data:team
            });
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal Server error",
                error
            })
            
        }
    },
    registerPlayers:async(req,res)=>{
        try {
            const updatedFields=req.body;
            if(!updatedFields){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Players are required"
                });
            }
            const player = await PlayerModel.findOneAndUpdate(
            {  player_name: updatedFields.player_name },
            { $set: updatedFields ,
            $setOnInsert: {
                player_statistics:{
                        'T20I':{},
                        'ODI':{},
                        'TestI':{},
                        'Domestic_T20':{},
                        'Domestic_OD':{},
                        'Domestic_Test':{}
                    }
                    }
            },
            { upsert: true, new: true }
            );
            if(!player){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Player not found"
                });
            }
            return res.status(201).json({
                success:true,
                status:201,
                message:"Player registered successfully",
                data:player
            });
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal Server error",
                error:error.message
            })
            
        }
    },
    registerTeams:async(req,res)=>{
        try {
        const updatedFields=req.body;
        if(!updatedFields){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Players are required"
            });
        }
        const team=await TeamModel.findOneAndUpdate(
            {  team_name: updatedFields.team_name },
            { $set: updatedFields },
            { upsert: true, new: true }
            );
        return res.status(201).json({
            success:true,
            status:201,
            message:"Team registered successfully",
            data:team
        });
            
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal Server error",
                error:error.message
            }) 
        }
        
    },
    getManagers:async(req,res)=>{
        try {
            const managers=await TeamManagerModel.find().lean();
            if(!managers){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Managers not found"
                });
            }
            return res.status(200).json({
                success:true,
                status:200,
                message:"Managers fetched successfully",
                data:managers
            });
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal Server error",
                error:error.message
            })
        }
    },
    updateMatchInfo:async(req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            const {id}=req.params;
            const {status,tossWinner,tossDecision}=req.body;
            const updatedFields={};
            if(status)updatedFields.status=status;
            if(tossWinner)updatedFields.tossWinner=tossWinner;
            if(tossDecision)updatedFields.tossDecision=tossDecision;
            

            const findMatch=await MatchModel.findById(id).session(session).populate({path:'team1',populate:{path:'playing11'}}).populate({path:'team2',populate:{path:'playing11'}});
            if(!findMatch){
                await session.abortTransaction();
                await session.endSession();
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Match not found"
                });
            }
            if (findMatch.team1.playing11.length!==11){
                await session.abortTransaction();
                await session.endSession();
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Team1 playing11 is not complete"
                })
            }
            if(findMatch.team2.playing11.length!==11){
                await session.abortTransaction();
                await session.endSession();
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Team2 playing11 is not complete"
                })
            }

            let team1_playing11_register=await Playing11Model.findOne({team_id:findMatch.team1._id,match_id:id}).session(session);
            if(!team1_playing11_register){
            team1_playing11_register=new Playing11Model({
                team_id:findMatch.team1._id,
                match_id:id,
                captain:findMatch.team1.captain,
                viceCaptain:findMatch.team1.viceCaptain,
                wicketKeeper:findMatch.team1.wicketKeeper,
                players:findMatch.team1.playing11.map(player=>player._id)
            });
        }

            let team2_playing11_register=await Playing11Model.findOne({team_id:findMatch.team2._id,match_id:id}).session(session);
            if(!team2_playing11_register){
            team2_playing11_register=new Playing11Model({
                team_id:findMatch.team2._id,
                match_id:id,
                captain:findMatch.team2.captain,
                viceCaptain:findMatch.team2.viceCaptain,
                wicketKeeper:findMatch.team2.wicketKeeper,
                players:findMatch.team2.playing11.map(player=>player._id)
            })
        }

            await Promise.all([
                team1_playing11_register.save({session}),
                team2_playing11_register.save({session})
             ]);
             updatedFields.playingXI_team1 = team1_playing11_register._id;
             updatedFields.playingXI_team2 = team2_playing11_register._id;

            const [team1_playing11, team2_playing11] = await Promise.all([
            Playing11Model.findOne({ team_id: findMatch.team1._id ,match_id:id}).session(session)
                .populate([
                { path: 'players' },
                { path: 'team_id' }
                ]),
            Playing11Model.findOne({ team_id: findMatch.team2._id ,match_id:id}).session(session)
                .populate([
                { path: 'players' },
                { path: 'team_id' }
                ]),
            ]);
            if(!team1_playing11 || !team2_playing11){
                await session.abortTransaction();
                await session.endSession();
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Playing11 not found"
                });
            }   
            let battingFirstTeam;
            let bowlingFirstTeam;

            if (tossDecision && tossWinner){
                if (tossDecision === 'bat') {
                battingFirstTeam = tossWinner.toString()===team1_playing11.team_id._id.toString()?team1_playing11:team2_playing11;
                } else {
                battingFirstTeam = tossWinner.toString() === team1_playing11.team_id._id.toString() ? team2_playing11: team1_playing11;
                }
                bowlingFirstTeam = battingFirstTeam === team1_playing11 ? team2_playing11 : team1_playing11;
                updatedFields.battingFirstTeam = battingFirstTeam._id;
                updatedFields.bowlingFirstTeam = bowlingFirstTeam._id;

            }
            console.log(updatedFields.battingFirstTeam)
            
            if(updatedFields.battingFirstTeam && updatedFields.bowlingFirstTeam){
                const existingInnings = await InningsModel.findOne({ match_id: id }).session(session);   
                if (!existingInnings) {
                const firstInnings=new InningsModel({
                battingTeam:updatedFields.battingFirstTeam,
                bowlingTeam:updatedFields.bowlingFirstTeam,
                match_id:id
            })
            await firstInnings.save({session});
            if(!findMatch.innings){
                findMatch.innings=[]    
            }
            findMatch.innings.push(firstInnings._id);
            findMatch.currentInnings=firstInnings._id;
            findMatch.InningsNumber=1;

            await firstInnings.populate([
                { path: 'battingTeam' ,options: { session }},
                { path: 'bowlingTeam',options: { session } }
                ]);

                firstInnings.battingScorecard = firstInnings.battingScorecard || [];
                firstInnings.bowlingScorecard = firstInnings.bowlingScorecard || [];

            for (const player of battingFirstTeam.players) {
                const firstInnings_batting_scorecard=new BattingModel({
                    innings_id:firstInnings._id,
                    player_id:player._id || player,
                    batting_status:'not_batted'
                })
                await firstInnings_batting_scorecard.save({session});
                await firstInnings.battingScorecard.push(firstInnings_batting_scorecard._id);
                const player_match_summary = new PlayerMatchSummaryModel({
                    player_id: player._id,
                    match_id: findMatch._id,
                    innings_id: firstInnings._id,
                    opponent_id: bowlingFirstTeam.team_id, 
                    format: findMatch.match_type,
                    match_date: findMatch.match_date,
                    is_innings_played: false 
                });
                await player_match_summary.save({session});
            }
            for (const player of bowlingFirstTeam.players) {
                const firstInnings_bowling_scorecard=new BowlingModel({
                    innings_id:firstInnings._id,
                    player_id:player._id || player,
                    bowling_status:'not_bowled'
                })
                await firstInnings_bowling_scorecard.save({session});
                await firstInnings.bowlingScorecard.push(firstInnings_bowling_scorecard._id);
                const player_match_summary = new PlayerMatchSummaryModel({
                    player_id: player._id,
                    match_id: findMatch._id,
                    innings_id: firstInnings._id,
                    opponent_id: battingFirstTeam.team_id, 
                    format: findMatch.match_type,
                    match_date: findMatch.match_date,
                    is_innings_played: false 
                });
                await player_match_summary.save({session});
            }
            await firstInnings.save({session});
            await firstInnings.populate([
                { path: 'battingScorecard',options: { session } },
                { path: 'bowlingScorecard',options: { session } }
            ]);
            }
         }
         
            if (updatedFields.status)               findMatch.status = updatedFields.status;
            if (updatedFields.tossWinner)           findMatch.tossWinner = updatedFields.tossWinner;
            if (updatedFields.tossDecision)         findMatch.tossDecision = updatedFields.tossDecision;
            if (updatedFields.battingFirstTeam)     findMatch.battingFirstTeam = updatedFields.battingFirstTeam;
            if (updatedFields.bowlingFirstTeam)     findMatch.bowlingFirstTeam = updatedFields.bowlingFirstTeam;
            if (updatedFields.playingXI_team1)    findMatch.playingXI_team1 = updatedFields.playingXI_team1;
            if (updatedFields.playingXI_team2)    findMatch.playingXI_team2 = updatedFields.playingXI_team2;
            await findMatch.save({session});
            const populatedMatch = await MatchModel.findById(id).session(session)
                                    .populate('team1')
                                    .populate('team2')
                                    .populate('tossWinner')
                                    .populate('innings')
                                    .populate('currentInnings');
            
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({
                success:true,
                status:200,
                message:"Match updated successfully",
                data:populatedMatch
            });
            
        }
        catch(error){
        await session.abortTransaction();
        session.endSession();
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal Server error",
                error:error.message
            })
        }
    },
    matchCompleted:async(req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction();
        try{
        const {matchId}=req.params;
        const{matchWinner,result,points,tournamentId,matchOutcome}=req.body;
        if(!matchId){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Match id is required"
            });
        }
        const match=await MatchModel.findById(matchId).session(session);
        if(!match){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Match not found"
                });
            }

        if(!matchWinner || !result || !points || !matchOutcome){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Match winner,match outcome, result and points are required"
            });
        }
        const updatedFields={};
        if(matchWinner)updatedFields.matchWinner=matchWinner;
        if(result)updatedFields.result=result;
        const loosingTeamId=matchWinner.toString()===match.team1.toString()?match.team2:match.team1;
        const matchType=match.match_type;
        const matchWinner_teaminfo=await TeamModel.findById(matchWinner).session(session);
        const loosing_teaminfo=await TeamModel.findById(loosingTeamId).session(session);
        matchWinner_teaminfo.statistics[matchType].matches_played+=1;
        loosing_teaminfo.statistics[matchType].matches_played+=1;
        if(matchOutcome==='winnerPresent'){
        matchWinner_teaminfo.statistics[matchType].wins+=1;
        loosing_teaminfo.statistics[matchType].losses+=1;
        }
        else if(matchOutcome==='draw'){
        matchWinner_teaminfo.statistics[matchType].draws+=1;
        loosing_teaminfo.statistics[matchType].draws+=1;
        }
        else if(matchOutcome==='noResult'){
        matchWinner_teaminfo.statistics[matchType].no_result+=1;
        loosing_teaminfo.statistics[matchType].no_result+=1;
        }
        await Promise.all([
            matchWinner_teaminfo.save({session}),
            loosing_teaminfo.save({session})
        ]);
        if(tournamentId ){
        const tournament=await TournamentModel.findById(tournamentId);
        if(!tournament){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Tournament not found"
            });
        }
                if(matchWinner&&result){
                    if(matchOutcome==='winnerPresent'){
                tournament.points_table.find(t=>t.team_id.toString()===matchWinner.toString()).points+=points;
                tournament.points_table.find(t=>t.team_id.toString()===matchWinner.toString()).matches_played+=1;
                tournament.points_table.find(t=>t.team_id.toString()===matchWinner.toString()).wins+=1;
                tournament.points_table.find(t=>t.team_id.toString()===loosingTeamId.toString()).points+=0;
                tournament.points_table.find(t=>t.team_id.toString()===loosingTeamId.toString()).matches_played+=1;
                tournament.points_table.find(t=>t.team_id.toString()===loosingTeamId.toString()).losses+=1;
                }
            }
                if(matchOutcome==='draw'){
                    tournament.points_table.find(t=>t.team_id.toString()===match.team1.toString()).points+=points;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team1.toString()).matches_played+=1;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team1.toString()).draws+=1;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team2.toString()).points+=points;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team2.toString()).matches_played+=1;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team2.toString()).draws+=1;
                }
                if(matchOutcome==='noResult'){
                    tournament.points_table.find(t=>t.team_id.toString()===match.team1.toString()).points+=0;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team1.toString()).matches_played+=1;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team1.toString()).no_result+=1;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team2.toString()).points+=0;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team2.toString()).matches_played+=1;
                    tournament.points_table.find(t=>t.team_id.toString()===match.team2.toString()).no_result+=1;
                }
            
            await tournament.save({session});
            }
            
            const matchUpdate=await MatchModel.findByIdAndUpdate(matchId,{$set:updatedFields},{new:true,session});
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({
                success:true,
                status:200,
                message:"Match updated successfully",
                data:matchUpdate
            });
            
       
        }
        catch(error){
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal Server error",
                error:error.message
            })

        }
    }
}
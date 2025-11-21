const { get } = require("mongoose");
const TeamModel = require("../Models/TeamModel");
const TournamentModel = require("../Models/TournamentModel");
const PlayerModel = require("../Models/PlayerModel");
const MatchModel = require("../Models/MatchModel");
const { path } = require("../Models/ExtrasSchema");

module.exports={
    getMatches:async(req,res)=>{
        try{
            const matches=await MatchModel.find({isDeleted:false})
            .populate('team1')
            .populate('team2')
            .populate('tossWinner')
            .lean();
            if(!matches){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Matches not found",
                    data:[]
                })
            }
            return res.status(200).json({
                success:true,
                status:200,
                message:"Match found",
                data:matches
            })
        }
        catch(error){
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })
        }

    },
    MatchDetails:async(req,res)=>{
        try {
            const {id}=req.params;
            const match=await MatchModel.findById(id)
            .populate('team1')
            .populate('team2')
            .populate('tournament')
            .populate('tossWinner')
            .populate({
                path: 'innings',
                populate: [
                    { path: 'battingTeam', populate: { path: 'team_id' } },
                    { path: 'bowlingTeam', populate: { path: 'team_id' } },
                    { path: 'battingScorecard', populate: { path: 'player_id' } },
                    { path: 'bowlingScorecard', populate: { path: 'player_id' } }
                ]
            })
            .populate({
                path: 'currentInnings',
                populate: [
                    { path: 'battingTeam', populate:[{ path: 'team_id' },{path:'players'}]},
                    { path: 'bowlingTeam', populate: [{ path: 'team_id' },{path:'players'}] },
                    { path: 'battingScorecard', populate: { path: 'player_id' } },
                    { path: 'bowlingScorecard', populate: { path: 'player_id' } }
                ]
            })
            .lean();
            if(!match){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Match not found",
                    data:match
                })
            }
            else{
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"Match found",
                    data:match
                })
            }
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })
        }
    },
    getInnings:async(req,res)=>{
        try {
            const {id}=req.params;
            const innings=await MatchModel.findById(id).lean();
            if(!innings){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Innings not found",
                    data:innings
                })
            }
            else{
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"Innings found",
                    data:innings
                })
            }
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })
        }
    },

    getTeams:async(req,res)=>{
        try{
            const teams=await TeamModel.find({isDeleted:false}).lean();
            if(!teams){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Teams not found",
                    data:[]
                })
            }
            
            else{
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"Teams found",
                    data:teams
                })
            }
        }
        catch(error){
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })


        }
    },
    getTeamDetails:async(req,res)=>{
        try {
        const {id}=req.params;
        const team=await TeamModel.findById(id).populate('team_manager').populate('team_captain').populate('team_players').populate('playing11').lean()
        if(!team){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Team not found",
                data:team
            });
        }
        else{
            return res.status(200).json({
                success:true,
                status:200,
                message:"Team found",
                data:team
            });
        }
        } 
        catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })
            
        }
    },
    getPlayers:async(req,res)=>{
        try{
            const players=await PlayerModel.find({isDeleted:false}).lean();
            if(!players){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Players not found",
                    data:[]
                })
            }
            else{
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"Players found",
                    data:players
                })
            }

        }
        catch(error){
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })
        }
    },
    getPlayerDetails:async(req,res)=>{
        try {
        const {id}=req.params;
        const player=await PlayerModel.findById(id).populate('player_teams');
        if(!player){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Player not found",
                data:player
            });
        }
        else{
            return res.status(200).json({
                success:true,
                status:200,
                message:"Player found",
                data:player
            });
        }
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            });  
        }
    },
    getTournaments:async(req,res)=>{
        try{
            const tournaments=await TournamentModel.find({isDeleted:false}).lean();
            if(!tournaments){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Tournaments not found",
                    data:[]
                })
            }
            else{
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"Tournaments found",
                    data:tournaments
                })
            }
        }
        catch(error){
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })
        
        }
    },

    getTournamentDetails:async(req,res)=>{
        try {
            const {id}=req.params;
            const tournament=await TournamentModel.findById(id)
                            .populate('tournament_teams')
                            .populate({path:'tournament_matches',populate:[{path:'team1'},{path:'team2'},{path:'tossWinner'}]})
                            .populate('points_table.team_id').lean();
            if(!tournament){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Tournament not found",
                    data:tournament
                });
            }
            else{
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"Tournament found",
                    data:tournament
                });
            }
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            });
        }
    },
    updateChat:async(req,res)=>{
        try{
            const {id}=req.params;
            const {chat}=req.body;
            if(!chat){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Chat not found",
                    data:chat
                });
            }
            else{
            const match=await MatchModel.findById(id);
            match.chat.push(chat);
            await match.save();
            if(!match){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"match not found",
                    data:chat
                });
            }
            else{
                return res.status(200).json({
                    success:true,
                    status:200,
                    message:"Chat found",
                    data:chat
                });
            }
        }      
    }    
     catch(error){
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error",
                error:error.message
            })
        }
    },
getChat:async(req,res)=>{
    try {
        const {id}=req.params;
        const match=await MatchModel.findById(id).lean();
        if(!match){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Chat not found",
            });
        }
        else{
            return res.status(200).json({
                success:true,
                status:200,
                message:"Chat found",
                data:match.chat
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal server error",
            error:error.message
        });
    }
    }
}
const PlayerMatchSummaryModel = require("../Models/PlayerMatchSumaryModel");

module.exports={
getPlayerPerformance:async(req,res)=>{
    try {
        const{id}=req.params;
        const{match_type,limit}=req.query;
        const player=await PlayerModel.findById(id).lean();
        if(!player){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Player not found"
            })
        }
        if(!match_type){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Match type and limit is required"
            })
        }
        const match_filter={
            player:player._id,
            match_type:match_type,
        };
        const aggregation_pipeline=[
            {$match:match_filter},
            {$sort:{_id:-1}},
        ]
            if(limit){
            aggregation_pipeline.push({$limit:limit});
         }
        aggregation_pipeline.push(
            {$group:
                {
                    _id:match_type?"$player_id":"$match_id",
                    total_matches:{$sum:1},
                    total_innings:{$sum:{$cond:[{$ifNull:["$is_innings_played",false]},1,0]}},
                    total_innins:{$sum:1},
                    total_runs:{$sum:"$batting.runs"},
                    total_balls:{$sum:"$batting.balls"},
                    total_fours:{$sum:"$batting.fours"},
                    total_sixes:{$sum:"$batting.sixes"},
                    total_notouts:{
                        $sum:{
                            $cond:[{
                                $eq:["$batting.batting_status","not_out"]
                            },1,0]
                        }
                    },
                    total_wickets:{$sum:"$bowling.wickets"},
                    total_maidens:{$sum:"$owling.maidens"},
                    total_overs:{$sum:"$bowling.overs"},
                    total_runs_given:{$sum:"$bowling.runs"},
                    total_ballsbowled:{$sum:"$bowling.balls"},
                }
            },
            {
                $addFields:{
                    battingAverage:{
                        $cond:[
                            {$gt:[{$subtract:["$total_innings","$total_notouts"]},0]},
                            {$divide:["$total_runs",{$subtract:["$total_innings","$total_notouts"]}]},
                            "$total_runs"
                        ]
                    },
                    strikeRate:{
                        $cond:[
                            {$gt:["$total_balls",0]},
                            {$multiply:[{$divide:["$total_runs","$total_balls"]},100]},
                            0
                        ]
                    },
                    economyRate:{
                        $cond:[
                            {$gt:["$total_overs",0]},
                            {$divide:["$total_runs_given","$total_overs"]},
                            0
                        ]
                    }
                }
            },
            {
                $project:{
                    _id:1,
                    total_matches:1,
                    total_innings:1,
                    total_runs:1,
                    total_balls:1,
                    total_fours:1,
                    total_sixes:1,
                    total_notouts:1,
                    total_wickets:1,
                    total_maidens:1,
                    total_overs:1,
                    total_runs_given:1,
                    total_ballsbowled:1,
                    battingAverage:1,
                    strikeRate:1,
                    economyRate:1,
                }
            }
        )
        const aggregate=await PlayerMatchSummaryModel.aggregate(aggregation_pipeline);

        const inningsQuery=await PlayerMatchSummaryModel.find(match_filter).populate("match_id").populate("opponent_id").sort({_id:-1}).lean();
        return res.status(200).json({
            success:true,
            status:200,
            message:"Player performance found",
            data:{
            match_type:match_type||"All formats",
            limit:limit?Number(limit):"No limit",
            inningsQuery,aggregate,player
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error while fetching player performance",
            error:error.message
        })
    }
    },
    savePlaying11:async(req,res)=>{
        try {
            const {team_id,players,captain,viceCaptain,wicketKeeper}=req.body;
            if(!team_id || !players || !captain || !viceCaptain || !wicketKeeper){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Team id, players, captain, viceCaptain and wicketKeeper is required"
                })
            }
            const team=await TeamModel.findById(team_id).lean();
            if(!team){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Team not found"
                })
            }
            team.captain=captain;
            team.viceCaptain=viceCaptain;
            team.wicketKeeper=wicketKeeper;
            team.playing11.push(players);
            await team.save();
            return res.status(200).json({
                success:true,
                status:200,
                message:"Playing11 saved successfully",
                data:team
            })
            
        } catch (error) {
            return res.status(500).json({
                success:false,
                status:500,
                message:"Internal server error while saving playing11",
                error:error.message
            })
        }
    },
getPlayervsPlayerPerformance:async(req,res)=>{
    try {
        const {player1,player2}=req.query;
        if(!player1||!player2){
            return res.status(400).json9({
                success:false,
                status:400,
                message:'Player1 or Player2 is missing'
            })
        }
        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal servor error while fetching PvsP players"
        })
        
    }
}
}
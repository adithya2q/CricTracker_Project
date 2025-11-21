const { default: mongoose } = require("mongoose");
const PlayerMatchSummaryModel = require("../Models/PlayerMatchSumaryModel");
const PlayerModel = require("../Models/PlayerModel");
const TeamModel = require("../Models/TeamModel");
const MatchModel = require("../Models/MatchModel");

const getAggregationPipeline=(match_filter,match_type,limit)=>{
        const aggregation_pipeline=[
            {$match:match_filter},
            {$sort:{_id:-1}},
        ]
            if(limit){
            aggregation_pipeline.push({$limit:parseInt(limit)});
         }
        aggregation_pipeline.push(
            {$group:
                {
                    _id:match_type?"$player_id":"$match_id",
                    total_matches:{$sum:1},
                    total_innings:{$sum:{$cond:[{$ifNull:["$is_innings_played",false]},1,0]}},
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
                    total_maidens:{$sum:"$bowling.maidens"},
                    total_overs:{$sum:"$bowling.overs"},
                    total_runs_given:{$sum:"$bowling.runs_conceded"},
                    total_ballsbowled:{$sum:"$bowling.balls_bowled"},
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
        return aggregation_pipeline;
    }

module.exports={
getPlayerPerformance:async(req,res)=>{
    try {
        const{targetId}=req.params;
        const{format,limit}=req.query;
        const player=await PlayerModel.findById(targetId).lean();
        if(!player){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Player not found"
            })
        }
        if(!format){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Match type and limit is required"
            })
        }
        const match_filter={
            player_id:player._id,
            format:format,
        };
        const pipeline=getAggregationPipeline(match_filter,format,limit);
        const aggregate=await PlayerMatchSummaryModel.aggregate(pipeline);
        const inningsQuery=await PlayerMatchSummaryModel.find(match_filter).populate([{path:"match_id"},{path:"tournament"}]).populate("opponent_id").sort({_id:-1}).lean();
        return res.status(200).json({
            success:true,
            status:200,
            message:"Player performance found",
            data:{
            aggregate:aggregate[0],
            format:format||"All formats",
            limit:limit?Number(limit):"No limit",
            inningsQuery,player
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
           
            const team=await TeamModel.findByIdAndUpdate(
                        team_id,
                        {
                            $set: {
                            playing11: players,          
                            captain,
                            viceCaptain,
                            wicketKeeper
                            }
                        },
                        { new: true }
                        );
            if(!team){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Team not found"
                })
            }
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
        const {player1,player2,match_type,limit}=req.query;
        if(!player1||!player2){
            return res.status(400).json({
                success:false,
                status:400,
                message:'Player1 or Player2 is missing'
            })
        }
        const [player1info,player2info]= await Promise.all([
           PlayerModel.findById(player1).lean(),
           PlayerModel.findById(player2).lean()
       ]);
        
        if(!player1info||!player2info){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Player details not found"
            })
        }
        const player1_match_filter={
            player_id:player1info._id,
            format:match_type,
        }

        const player2_match_filter={
            player_id:player2info._id,
            format:match_type,
        }
        console.log(player1_match_filter)
        const [player1Performance,player2Performance]=await Promise.all([
            PlayerMatchSummaryModel.aggregate(getAggregationPipeline(player1_match_filter,match_type,limit)),
            PlayerMatchSummaryModel.aggregate(getAggregationPipeline(player2_match_filter,match_type,limit))
        ])
        console.log(player1Performance)
        console.log(player2Performance)

        if(!player1Performance||!player2Performance){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Player performance not found"
            })
        }

        return res.status(200).json({
            success:true,
            status:200,
            message:"Player performance found",
            data:{player1Performance:player1Performance[0],
                player2Performance:player2Performance[0],
                player1info,
                player2info,
                match_type:match_type||"All formats",
                limit:limit?Number(limit):"All"
                }
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal servor error while fetching PvsP players"
        })
        
    }
},
getBatsmanVsBowlerPerformance:async(req,res)=>{
    try {
        const {player1:batsman,player2:bowler,match_type,limit}=req.query;
        if(!batsman||!bowler){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Batsman or Bowler is missing"
            })
        }
        const batsmaninfo=await PlayerModel.findById(batsman).lean();
        const bowlerinfo=await PlayerModel.findById(bowler).lean();
        if(!batsmaninfo||!bowlerinfo){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Player details not found"
            })
        }
        const matchStage = {
        player_id: batsmaninfo._id,
        "batting.bowlers_faced.bowler_id":bowlerinfo._id,
        };

        if (match_type) {
        matchStage.format = match_type;
        }

        const pipeline = [
        { $match: matchStage },
        ];

        if (limit) {
        pipeline.push({ $limit: Number(limit) });
        }

        pipeline.push( { $unwind: "$batting.bowlers_faced" },

      {
        $match: {
          "batting.bowlers_faced.bowler_id":bowlerinfo._id,
        },
      },
      {
        $group: {
          _id: null,
          total_balls: { $sum: "$batting.bowlers_faced.balls_bowled" },
          total_runs: { $sum: "$batting.bowlers_faced.runs_conceded" },
          total_dismissals: {
            $sum: {
              $cond: [
                { $eq: ["$batting.bowlers_faced.is_dismissed", true] },
                1,
                0,
              ],
            },
          },
          matches_played: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          total_balls: 1,
          total_runs: 1,
          total_dismissals: 1,
          matches_played: 1,
          strike_rate: {
            $cond: [
              { $gt: ["$total_balls", 0] },
              { $multiply: [{ $divide: ["$total_runs", "$total_balls"] }, 100] },
              0,
            ],
          },
          economy_rate: {
            $cond: [
              { $gt: ["$total_balls", 0] },
              { $divide: ["$total_runs", "$total_balls"] },
              0,
            ],
          },
        },
      },)
    const BatsmanVsBowler = await PlayerMatchSummaryModel.aggregate(pipeline);
    if(!BatsmanVsBowler){
        return res.status(404).json({
            success:false,
            status:404,
            message:"Batsman vs Bowler performance not found"
        })
    }

    return res.status(200).json({
        success:true,
        status:200,
        message:"Batsman vs Bowler performance found",
        data:{BatsmanVsBowler:BatsmanVsBowler[0],
            batsmaninfo,bowlerinfo,
            match_type:match_type||"All formats",
            limit:limit?Number(limit):"All"
        }
    })


}catch(error){
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal server error while fetching batsman vs bowler performance",
            error:error.message
        })
}
},
getTeamVsTeamPerformance:async(req,res)=>{
    try {
        const {team1,team2,match_type,limit}=req.query;
        if(!team1||!team2){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Team1 or Team2 is missing" 
            })
        }
        const teamA = await TeamModel.findById(team1);
        const teamB = await TeamModel.findById(team2);
        if(!teamA||!teamB){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Team details not found"
            })
        }
        const teamAId = teamA._id;
        const teamBId = teamB._id;
        const matchStage = {
        $or: [
            { team1: teamA._id, team2: teamB._id },
            { team1: teamB._id, team2: teamA._id }
        ]
        };

        if (match_type) {
        matchStage.match_type = match_type;
        }

        const pipeline = [
        { $match: matchStage },
        ];


        if (limit && Number(limit) > 0) {
        pipeline.push({ $limit: Number(limit) });
        }

        pipeline.push(

  {
    $group: {
      _id: null,
      matches_played: { $sum: 1 },
      teamA_wins: {
        $sum: { $cond: [{ $eq: ["$matchWinner", teamAId] }, 1, 0] }
      },
      teamB_wins: {
        $sum: { $cond: [{ $eq: ["$matchWinner", teamBId] }, 1, 0] }
      },
      draws: {
        $sum: {
          $cond: [
            {
              $or: [
                { $eq: ["$result", "draw"] },
                { $eq: ["$result", "tie"] },
                { $eq: ["$result", "no result"] }
              ]
            },
            1,
            0
          ]
        }
      }
    }
  },

  {
    $addFields: {
      teamAId: teamA._id,
      teamBId: teamB._id
    }
  },

 
  {
    $lookup: {
      from: "teams",
      localField: "teamAId",
      foreignField: "_id",
      as: "teamAData"
    }
  },
  { $unwind: "$teamAData" },


  {
    $lookup: {
      from: "teams",
      localField: "teamBId",
      foreignField: "_id",
      as: "teamBData"
    }
  },
  { $unwind: "$teamBData" },

  {
    $project: {
      _id: 0,
      team1: "$teamAData.team_name",
      team2: "$teamBData.team_name",
      matches_played: 1,
      team1_wins: "$teamA_wins",
      team2_wins: "$teamB_wins",
      draws: 1,
      team1_logo: "$teamAData.team_logo",
      team2_logo: "$teamBData.team_logo",
      team1_matches_played: `$teamAData.statistics.${match_type}.matches_played`,
      team2_matches_played: `$teamBData.statistics.${match_type}.matches_played`,
      team1_total_wins: `$teamAData.statistics.${match_type}.wins`,
      team2_total_wins: `$teamBData.statistics.${match_type}.wins`,
      team1_total_losses: `$teamAData.statistics.${match_type}.losses`,
      team2_total_losses: `$teamBData.statistics.${match_type}.losses`,
      team1_total_draws: `$teamAData.statistics.${match_type}.draws`,
      team2_total_draws: `$teamBData.statistics.${match_type}.draws`,
      team1_total_no_result: `$teamAData.statistics.${match_type}.no_result`,
      team2_total_no_result: `$teamBData.statistics.${match_type}.no_result`,
      team1_total_trophies: "$teamAData.team_trophies_won",
      team2_total_trophies: "$teamBData.team_trophies_won"
    }
  }
);
        const teamVsTeamPerformance = await MatchModel.aggregate(pipeline);
        console.log("teamVsTeamPerformance",teamVsTeamPerformance);
        if(!teamVsTeamPerformance[0]){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Team vs team performance not found"
            })
        }
        return res.status(200).json({
            success:true,
            status:200,
            message:"Team vs team performance fetched successfully",
            data:{teamVsTeamPerformance:teamVsTeamPerformance[0],
            team1:teamA,team2:teamB,
            match_type:match_type||"All formats",
            limit:limit?Number(limit):"All"
            }
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal server error while fetching team vs team performance",
            error:error.message
        })
    }
    },
getPlayerVsTeamPerformance:async(req,res)=>{
    try {
        const {player,team,match_type,limit}=req.query;
        if(!player||!team){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Player or Team is missing"
            })
        }
        const playerinfo=await PlayerModel.findById(player).lean();
        const teaminfo=await TeamModel.findById(team).lean();
        if(!playerinfo||!teaminfo){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Player or Team not found"
            })
        }
        const match_filter={
            player_id:playerinfo._id,
            opponent_id:teaminfo._id,   
        };
        if(match_type){
           match_filter.format=match_type;
        }
        const playerPerformance=await PlayerMatchSummaryModel.aggregate(getAggregationPipeline(match_filter,match_type,limit));
        if(!playerPerformance[0]){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Player vs team performance not found"
            })
        }
        return res.status(200).json({
            success:true,
            status:200,
            message:"Player vs team performance fetched successfully",
            data:{playerPerformance:playerPerformance[0],
            playerinfo,teaminfo,
            match_type:match_type||"All formats",
            limit:limit?Number(limit):"All"}
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal server error while fetching player vs team performance",
            error:error.message
        })
        
    }
}
}
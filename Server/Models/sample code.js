const mongoose = require("mongoose");

const PlayerMatchSummarySchema = new mongoose.Schema({
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  match_id: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
  opponent_team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  format: { type: String, enum: ["T20", "ODI", "TEST", "Domestic_T20", "Domestic_ODI", "Domestic_Test"] },
  match_date: { type: Date, required: true },

  // 🏏 Batting
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  dismissal_type: { type: String, default: null },
  is_not_out: { type: Boolean, default: false },

  // 🎯 Bowling
  wickets: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  balls_bowled: { type: Number, default: 0 },
  runs_conceded: { type: Number, default: 0 },
  economy_rate: { type: Number, default: 0 },
  wicket_types: [{ type: String }], // e.g. ["bowled", "caught"]

  // 🧠 Optional: store player-vs-player dismissals
  dismissals_against: [{
    bowler_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    type: String // e.g. "bowled", "caught"
  }]

}, { timestamps: true });

module.exports = mongoose.model("PlayerMatchSummary", PlayerMatchSummarySchema);
const PlayerMatchSummary = require("../Models/PlayerMatchSummaryModel");
const Match = require("../Models/MatchModel");
const Inning = require("../Models/InningsModel");
const BattingScore = require("../Models/BattingScoreModel");
const BowlingScore = require("../Models/BowlingScoreModel");

async function generatePlayerSummaries(matchId) {
  try {
    const match = await Match.findById(matchId)
      .populate("innings") // assuming array of inning IDs
      .lean();

    if (!match) throw new Error("Match not found");

    const allInnings = await Inning.find({ match_id: matchId })
      .populate("BattingScorecard BowlingScorecard")
      .lean();

    const summaries = [];

    for (const inning of allInnings) {
      const battingScores = inning.BattingScorecard || [];
      const bowlingScores = inning.BowlingScorecard || [];

      // 🏏 Process Batting
      for (const bat of battingScores) {
        const opponent_team_id = (inning.battingTeam.toString() === match.teamA.toString())
          ? match.teamB
          : match.teamA;

        // Find bowling entry if this player bowled in the same match
        const bowl = bowlingScores.find(b => b.Bowler_id?.toString() === bat.player_id?.toString());

        const summary = {
          player_id: bat.player_id,
          match_id: match._id,
          opponent_team_id,
          format: match.match_type,
          match_date: match.match_date,

          // batting
          runs: bat.Runs,
          balls: bat.Balls,
          fours: bat.Fours,
          sixes: bat.Sixes,
          dismissal_type: bat.DismissalType || null,
          is_not_out: bat.Batting_status === "not_out",

          // bowling (if exists)
          wickets: bowl ? bowl.Wickets : 0,
          overs: bowl ? bowl.Overs : 0,
          balls_bowled: bowl ? bowl.Balls : 0,
          runs_conceded: bowl ? bowl.Runs : 0,
          economy_rate: bowl && bowl.Overs > 0 ? (bowl.Runs / bowl.Overs) : 0,
          wicket_types: bowl ? bowl.WicketTypes || [] : [],

          // player vs player dismissals
          dismissals_against: bat.DismissedBy ? [{
            bowler_id: bat.DismissedBy,
            type: bat.DismissalType
          }] : []
        };

        summaries.push(summary);
      }
    }

    // 🧾 Bulk insert summaries
    if (summaries.length) {
      await PlayerMatchSummary.insertMany(summaries);
      console.log(`✅ ${summaries.length} player summaries added for match ${matchId}`);
    } else {
      console.log("⚠️ No batting entries found for this match");
    }

  } catch (err) {
    console.error("❌ Error generating player summaries:", err);
  }
}

module.exports = generatePlayerSummaries;


















const playerId = new mongoose.Types.ObjectId("<PLAYER_ID>");
const format = "T20I";

const pipeline = [
  // 1️⃣ Match filter - only include matches of given format
  {
    $match: {
      match_type: format,
      status: "completed" // optional: only finished matches
    }
  },

  // 2️⃣ Lookup innings for each match
  {
    $lookup: {
      from: "innings",
      localField: "innings",
      foreignField: "_id",
      as: "inningsData"
    }
  },

  { $unwind: "$inningsData" },

  // 3️⃣ Lookup batting entries for this player
  {
    $lookup: {
      from: "battingscores",
      localField: "inningsData.BattingScorecard",
      foreignField: "_id",
      as: "battingEntries"
    }
  },

  // 4️⃣ Lookup bowling entries for this player
  {
    $lookup: {
      from: "bowlingscores",
      localField: "inningsData.BowlingScorecard",
      foreignField: "_id",
      as: "bowlingEntries"
    }
  },

  // 5️⃣ Filter batting and bowling for this specific player
  {
    $project: {
      battingEntries: {
        $filter: {
          input: "$battingEntries",
          as: "bat",
          cond: { $eq: ["$$bat.player_id", playerId] }
        }
      },
      bowlingEntries: {
        $filter: {
          input: "$bowlingEntries",
          as: "bowl",
          cond: { $eq: ["$$bowl.Bowler_id", playerId] }
        }
      }
    }
  },

  // 6️⃣ Unwind both batting and bowling (may not exist for every match)
  { $unwind: { path: "$battingEntries", preserveNullAndEmptyArrays: true } },
  { $unwind: { path: "$bowlingEntries", preserveNullAndEmptyArrays: true } },

  // 7️⃣ Group by player to sum stats
  {
    $group: {
      _id: playerId,
      matches_played: { $sum: 1 },
      innings_played: {
        $sum: {
          $cond: [{ $ifNull: ["$battingEntries", false] }, 1, 0]
        }
      },
      runs: { $sum: "$battingEntries.Runs" },
      balls_faced: { $sum: "$battingEntries.Balls" },
      fours: { $sum: "$battingEntries.Fours" },
      sixes: { $sum: "$battingEntries.Sixes" },
      not_outs: {
        $sum: {
          $cond: [{ $eq: ["$battingEntries.Batting_status", "not_out"] }, 1, 0]
        }
      },
      wickets: { $sum: "$bowlingEntries.Wickets" },
      runs_given: { $sum: "$bowlingEntries.Runs" },
      balls_bowled: { $sum: "$bowlingEntries.Balls" },
      overs_bowled: { $sum: "$bowlingEntries.Overs" },
      economy_sum: { $sum: "$bowlingEntries.EconomyRate" },
    }
  },

  // 8️⃣ Compute derived metrics
  {
    $addFields: {
      batting_average: {
        $cond: [
          { $gt: [{ $subtract: ["$innings_played", "$not_outs"] }, 0] },
          { $divide: ["$runs", { $subtract: ["$innings_played", "$not_outs"] }] },
          "$runs"
        ]
      },
      strike_rate: {
        $cond: [{ $gt: ["$balls_faced", 0] },
          { $multiply: [{ $divide: ["$runs", "$balls_faced"] }, 100] },
          0
        ]
      },
      bowling_average: {
        $cond: [{ $gt: ["$wickets", 0] },
          { $divide: ["$runs_given", "$wickets"] },
          0
        ]
      },
      economy_rate: {
        $cond: [{ $gt: ["$overs_bowled", 0] },
          { $divide: ["$runs_given", "$overs_bowled"] },
          0
        ]
      }
    }
  }
];


    shots_played:[{
        shots_type:{
            type:String,
            enum:['straight drive','cover drive','off drive','on drive','sweep','pull shot','cut shot','hook','late cut',]
        },
        runs_scored:{
            type:Number,
            default:0
        },
        ball_line:{
            type:String,
            enum:['legstump','middlestump','offstump','outsideoff','outsideleg','near outside wide']
        },
        ball_length:{
            type:String,
            enum:['yorker','Full','Good','Short','Fulltoss']
        },
        ball_type:{
            type:String,
            enum:['legbreak','fullbreak','shortbreak','inswinnger','offspin','googly','Knucklball','top spin','bouncer','shortball']
        },
        shot_placed_area:{
            type:String,
            enum:['third man','point','cover','long off','long on','mid wicket','square leg','fine leg']
        },
        bowler_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Player',
            required:true
        }
    }]


    // update match score
    striker_match_summary.batting.bowlers_faced.bowler_id=bowler._id;
            striker_match_summary.batting.bowlers_faced.balls_runs+=Number(runs)||0;

            
            innings.Runs+=Number(runs)||0;
            Striker.Runs+=Number(runs)||0;
            Bowler.Runs+=Number(runs)||0;
            Bowler.runs_this_over+=Number(runs)||0;
            if (!innings.Extras) {
                        innings.Extras = { total: 0, wide: 0, noball: 0, bye: 0, legbye: 0 };
                        }
                        innings.Extras.total+=Number(extras)||0;
                        innings.Runs+=Number(extras)||0;
                        Bowler.Runs+=Number(extras)||0;
                        Bowler.runs_this_over+=Number(extras)||0;
            
                        if(extrasType){
                            innings.Extras[extrasType]+=Number(extras)||0;
                            if(extrasType!=="wide" && extrasType!=="noball"){
                                innings.Balls+=1;
                                Striker.Balls+=1;
                                Bowler.Balls+=1;
                                innings.Overs=Math.floor(innings.Balls/6)+(innings.Balls%6)/10;
                                Bowler.Overs=Math.floor(Bowler.Balls/6)+(Bowler.Balls%6)/10;
                                if(Bowler.Balls%6===0&&Bowler.Balls!==0){
                                    if(Bowler.runs_this_over===0){
                                        Bowler.maidens+=1;
                                        bowler_match_summary.bowling.maidens+=1;
                                    }
                                }
                            }
            
                        }
                        else{
                            innings.Balls+=1;
                            Striker.Balls+=1;
                            Bowler.Balls+=1;
                            innings.Overs=Math.floor(innings.Balls/6)+(innings.Balls%6)/10;
                            Bowler.Overs=Math.floor(Bowler.Balls/6)+(Bowler.Balls%6)/10;
                            if(Bowler.Balls%6===0&&Bowler.Balls!==0){
                            if(Bowler.runs_this_over===0){
                                        Bowler.maidens+=1;
                                        bowler_match_summary.bowling.maidens=(bowler_match_summary.bowling.maidens || 0) + 1;
                                    }
                                Bowler.runs_this_over=0;
                                }
                        }
                        let strike_rotate_run
                        if(is_legal_ball){
                          strike_rotate_run=Number(runs)+Number(extras);
                          if(Innings.balls%6===0&&Innings.balls!==0){
                          strike_rotate_run=Number(runs)+Number(extras);
                          if(strike_rotate_run%2===0){
                            strikerbat=nonstriker
                          }
                          else{
                            strikerbat=striker;
                          }
                          }
                          else{
                            if(strike_rotate_run%2===0){
                            strikerbat=striker
                          }
                          else{
                            strikerbat=non_striker;
                          }
                          }
                          }
                          else{
                        if(extrasType=='wide'){
                          strike_rotate_run=Number(extras)-1;
                        }
                        if(extrasType=='noball'){
                          strike_rotate_run=Number(runs);
                        }
                          if(strike_rotate_run%2===0){
                            strikerbat=striker
                          }
                          else{
                            strikerbat=non_striker;
                          }
                        }

                                        battingTeam=match.battingFirstTeam.toString()===match.playingXI_team1.toString()?match.playingXI_team1._id:match.playingXI_team2._id;
                bowlingTeam=match.bowlingFirstTeam.toString()===match.playingXI_team1.toString()?match.playingXI_team1._id:match.playingXI_team2._id;



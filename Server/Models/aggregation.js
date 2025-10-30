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

const mongoose = require("mongoose");

const DismissalSchema = new mongoose.Schema({
  dismissal_type: {
    type: String,
    enum: [
      "bowled",
      "caught",
      "lbw",
      "stumped",
      "run_out",
      "hit_wicket",
      "obstructing_field",
      "retired_hurt",
      "retired_out",
    ],
  },
  batsman_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  },
  bowler_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  },
  fielder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
});


const DismissalModel = mongoose.model("Dismissal", DismissalSchema);
module.exports = DismissalModel;

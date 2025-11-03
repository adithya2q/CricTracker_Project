const BattingModel = require("../Models/BattingModel");
const InningsModel = require("../Models/InningsModel");
const MatchModel = require("../Models/MatchModel");
const PlayerMatchSummaryModel = require("../Models/PlayerMatchSumaryModel");

module.exports={
updateCommentary:async(req,res)=>{
    try{
        const {id}=req.params;
        const {commentary}=req.body;
        if(!commentary){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Commentary is required"
            })
        }
        if(!id){
            return res.status(400).json({
                success:false,
                status:400,
                message:"Match id is required"
            })
        }
        const match=await MatchModel.findByIdAndUpdate(id,{$push:{commentary}},{new:true}).lean();
        if(!match){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Match not found"
            })
        }
        return res.status(200).json({
            success:true,
            status:200,
            message:"Commentary updated successfully",
            data:match        
        })      

    }
    catch(error){
        return res.status(500).json({
            succes:false,
            status:500,
            message:"Internal Server error",
            error:error.message
        })
        }
    },
    updateMatchScore:async(req,res)=>{
        try {
            const {id}=req.params;
            const {score}=req.body;
            if(!score){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Score is required"
                })
            }
            if(!id){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Match id is required"
                })
            }
            const{striker,non_striker,bowler,extras,extrasType,wicket,wicketType,boundary,sixer,fielder,runs,run_out_player}=score;
            if(!striker||!non_striker|| !bowler){
                return res.status(400).json({
                    success:false,
                    status:400,
                    message:"Striker,non striker and bowler are required"
                })
                
            }
            const match=await MatchModel.findById(id);
                if(!match){
                    return res.status(404).json({
                        success:false,
                        status:404,
                        message:"Match not found"
                    })
                }
            let innings=await InningsModel.findOne({match_id:id,isCompleted:false})
                        .sort({createdAt:-1})
                        .populate("batting_team")
                        .populate("bowling_team")
                        .populate("BattingScorecard")
                        .populate("BowlingScorecard")


            if(!innings){
                innings=await InningsModel.create({
                    match_id:id,
                    battingTeam:match.battingFirstTeam,
                    bowlingTeam:match.bowlingFirstTeam, 
                    BattingScorecard:[],
                    BowlingScorecard:[]
                });

            }
            let Striker=await BattingModel.findOne({innings_id:innings._id,player_id:striker._id})
                        .populate("Dismissal");
            if(!Striker){
                Striker=await BattingModel.create({
                    innings_id:innings._id,
                    player_id:striker._id,
                    Runs:0,
                    Balls:0,
                    Fours:0,
                    Sixes:0,
                    StrikeRate:0,
                    Batting_status:"not_out"

                })
            }
            let nonStriker=await BattingModel.findOne({innings_id:innings._id,player_id:non_striker._id})
                        .populate("Dismissal");

            if(!nonStriker){
                nonStriker=await BattingModel.create({
                    innings_id:innings._id,
                    player_id:non_striker._id,
                    Runs:0,
                    Balls:0,
                    Fours:0,
                    Sixes:0,
                    StrikeRate:0,
                    Batting_status:"not_out"
                })
            }
            let Bowler=await BowlingModel.findOne({innings_id:innings._id,player_id:bowler._id})
                        .populate("Dismissal");
            if(!Bowler){
                Bowler=await BowlingModel.create({
                    innings_id:innings._id,
                    player_id:bowler._id,
                    Runs:0,
                    Wickets:0,
                    Overs:0,
                    Maidens:0,
                    EconomyRate:0
                })
            }
            let striker_match_summary=await PlayerMatchSummaryModel.findOne({player_id:striker._id,match_id:id});
            if(!striker_match_summary){
                striker_match_summary=await PlayerMatchSummaryModel.create({
                    player_id:striker._id,
                    match_id:match._id,
                    innings_id:innings._id,
                    opponent_id:innings.bowlingTeam._id,
                    format:match.match_type,
                    match_date:match.match_date,
                })
            }
            let non_striker_match_summary=await PlayerMatchSummaryModel.findOne({player_id:non_striker._id,match_id:id});
            if(!non_striker_match_summary){
               non_striker_match_summary=await PlayerMatchSummaryModel.create({
                    player_id:non_striker._id,
                    match_id:match._id,
                    innings_id:innings._id,
                    opponent_id:innings.bowlingTeam._id,
                    format:match.match_type,
                    match_date:match.match_date,
                })
            }

            let bowler_match_summary=await PlayerMatchSummaryModel.findOne({player_id:bowler._id,match_id:id});
            if(!bowler_match_summary){
                bowler_match_summary=await PlayerMatchSummaryModel.create({
                    player_id:bowler._id,
                    match_id:match._id,
                    innings_id:innings._id,
                    opponent_id:innings.battingTeam._id,
                    format:match.match_type,
                    match_date:match.match_date,
                })
            }
            striker_match_summary.batting = striker_match_summary.batting || {};
            if (!Array.isArray(striker_match_summary.batting.bowlers_faced)) {
                  striker_match_summary.batting.bowlers_faced = [];
                }

                let existingEntry = striker_match_summary.batting.bowlers_faced.find(
                        (b) => b.bowler_id.toString() === bowler._id.toString()
                        );

            if(!existingEntry){
                newEntry={bowler_id:bowler._id};
                striker_match_summary.batting.bowlers_faced.push(newEntry);
                existingEntry=newEntry;
            }

            const runs_off_bat = (Number(runs) || 0) + (boundary ? 4 : 0) + (sixer ? 6 : 0);
            const extra_runs=Number(extras)||0;
            let is_legal_ball=false; 
            let runs_against_bowler=runs_off_bat;
            innings.Runs=(innings.Runs||0)+(runs_off_bat||0)+(extra_runs||0);
            
            Striker.Runs+=runs_off_bat;
            if (!innings.Extras) {
                innings.Extras = { total: 0, wide: 0, noball: 0, bye: 0, legbye: 0 };
            }
            innings.Extras.total+=extra_runs;
            if(extrasType){
                if(innings.Extras[extrasType]!==undefined){
                    innings.Extras[extrasType]+=extra_runs;
                }
                if(extrasType=='wide'||extrasType=='noball'){
                    is_legal_ball=false;
                    runs_against_bowler+=extra_runs;
                }
                else{
                    is_legal_ball=true;
                }
            }
            else{
                is_legal_ball=true;
            }
        Bowler.Runs = (Bowler.Runs || 0) + runs_against_bowler;
        existingEntry.runs_conceded=( existingEntry.runs_conceded||0)+runs_against_bowler;
        Bowler.runs_this_over = (Bowler.runs_this_over || 0) + runs_against_bowler;


        if (is_legal_ball) {
            innings.Balls += 1;
            Striker.Balls += 1;
            Bowler.Balls += 1;
            existingEntry.balls_bowled=(existingEntry.balls_bowled||0)+1;
            innings.Overs = Math.floor(innings.Balls / 6) + (innings.Balls % 6) / 10;
            Bowler.Overs = Math.floor(Bowler.Balls / 6) + (Bowler.Balls % 6) / 10;

            if(Bowler.Balls%6===0&&Bowler.Balls!==0){
                if(Bowler.runs_this_over===0){
                    Bowler.Maidens+=1;
                    bowler_match_summary.bowling.maidens+=1;
                }
                Bowler.runs_this_over=0;
            }
        }
        


            if(wicket){
            innings.Wickets+=Number(wicket)||0;
            const newDismissal=await DismissalModel.create({
                dismissal_type:wicketType,
            })
            
            if(wicketType!='runout'){
                newDismissal.batsman_id=striker._id;
                newDismissal.bowler_id=bowler._id;
                newDismissal.fielder_id=fielder._id?fielder._id:null;
                await newDismissal.save();
                Striker.Dismissal=newDismissal._id;
                Bowler.Dismissal.push(newDismissal._id);
                Striker.Batting_status='out';
                bowler_match_summary.bowling.wickets+=Number(wicket)||0;
                existingEntry.is_dismissed=true;
                Bowler.Wickets+=Number(wicket)||0;

            }
            else{
                if(run_out_player){
                    if(run_out_player._id==striker._id){
                        newDismissal.batsman_id=striker._id;
                        newDismissal.bowler_id=bowler._id;
                        newDismissal.fielder_id=fielder._id?fielder._id:null;
                        newDismissal.save();
                        Striker.Dismissal=newDismissal._id;
                        Striker.Batting_status='out';
                    }else{
                        newDismissal.batsman_id=striker._id;
                        newDismissal.bowler_id=bowler._id;
                        newDismissal.fielder_id=fielder._id?fielder._id:null;
                        newDismissal.save();
                        nonStriker.Dismissal=newDismissal._id;
                        nonStriker.Batting_status='out';
                    }
                }
            }
                }
                let strike_rotate_run;
                let strikerbat;
                if(is_legal_ball){
                  strike_rotate_run=Number(runs)+Number(extras);
                  if(innings.balls%6===0 && innings.balls!==0){
                  strike_rotate_run=Number(runs)+Number(extras);
                  if(strike_rotate_run%2===0){
                    strikerbat=nonStriker;
                  }
                  else{
                    strikerbat=striker;
                  }
                  }
                  else{
                    if(strike_rotate_run%2===0){
                    strikerbat=striker;
                  }
                  else{
                    strikerbat=nonStriker;
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
                    strikerbat=nonStriker;
                  }
                }
            innings.runRate=innings.Overs === 0 ? innings.Runs : ((innings.Runs / innings.Balls)*6).toFixed(2);
            innings.Boundaries+=Number(boundary)||0;
            Striker.Boundaries+=Number(boundary)||0;
            innings.Sixes+=Number(sixer)||0;
            Striker.Sixes+=Number(sixer)||0;
            await innings.save();
            await striker_match_summary.save();
            await bowler_match_summary.save();
            Bowler.EconomyRate = Bowler.Balls > 0 ? ((Bowler.Runs / Bowler.Balls) * 6).toFixed(2) : 0;
            Striker.StrikeRate=Striker.Balls === 0 ? 0:(Striker.Runs/Striker.Balls)*100;
            await Striker.save();
            await nonStriker.save();
            await Bowler.save();


            return res.status(200).json({
                success:true,
                status:200,
                message:"Score updated successfully",
                strikerbat
            })

    } catch (error) {
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal Server error",
            error:error.message
        })
        
    }
    },
switchInnings:async(req,res)=>{
    try {
        const{id}=req.params;
        const match=await MatchModel.findById(id).populate('innings');
        if(!match){
            return res.status(404).json({
                success:false,
                status:404,
                message:"Match not found"
            })
        }

        const currentInnigsIndex=match.InningsNumber-1;
        const currentInnings=await InningsModel.findById(match.innings[currentInnigsIndex]);

        if(currentInnings){
            currentInnings.isCompleted = true;
            await currentInnings.save();
        }

        match.InningsNumber+=1;
        if((match.match_type==='TestI' || match.match_type==='Domestic_Test')&& match.InningsNumber<=4){
            let battingTeam,bowlingTeam
            if(match.InningsNumber%2===1){
                battingTeam=match.battingFirstTeam
                bowlingTeam=match.bowlingFirstTeam
            }
            else{
                battingTeam=match.bowlingFirstTeam;
                bowlingTeam=match.battingFirstTeam;
            }
            const newInnings=new InningsModel({
                match_id:id,
                battingTeam,
                bowlingTeam
            });
            await newInnings.save();
            match.innings.push(newInnings._id);
            match.currentInnings=newInnings._id;
            await match.save()
            for (const player of battingTeam.players) {
                const currentInnings_batting_scorecard=new BattingScorecardModel({
                    innings:newInnings._id,
                    player:player._id,
                    batting_status:'not_batted'
                })
                await currentInnings_batting_scorecard.save();
            }
            for (const player of bowlingTeam.players) {
                const currentInnings_bowling_scorecard=new BowlingScorecardModel({
                    innings:newInnings._id,
                    player:player._id,
                    batting_status:'not_bowled'
                })
                await currentInnings_bowling_scorecard.save();
            }

            return res.status(200).json({
                succes:true,
                status:200,
                message: `Switched to innings ${match.InningsNumber}`,
                data: match,newInnings,
            })
        }

        if(match.match_type !== 'Test'&& match.match_type !== 'Domestic_Test'&& match.InningsNumber<=2){
            const newInnings=new InningsModel({
                match_id:id,
                battingTeam:match.bowlingFirstTeam,
                bowlingTeam:match.battingFirstTeam
            })
            await newInnings.save();

            match.innings.push(newInnings._id);
            match.currentInnings=newInnings._id;
            await match.save();
            return res.status(200).json({
                success:true,
                status:200,
                message: `Switched to innings ${match.InningsNumber}`,
                data: match,newInnings,
            })

        }
        if (
            (match.match_type !== 'Test'&& match.match_type !== 'Domestic_Test' && match.currentInnings > 2) ||
            (match.match_type === 'Test'&& match.match_type !== 'Domestic_Test'&& match.currentInnings > 4)
            ) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Match is completed',
            });
            }
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal server error;Error switching innings",
            error:error.message
        })
        
    }
    },
matchComplete:async(req,res)=>{
    try {
        const {id}=req.body;
        const match=await MatchModel.findById(id);
        if(!match){
            return res.status(404).json({
                success:false,
                status:404,
                message:'Match not found',
            })
        }
        match.status='completed';
        const team1 = await Playing11Model.findById(match.battingTeam);
        const team2 = await Playing11Model.findById(match.bowlingTeam);
        const allPlayers = [...team1.players, ...team2.players];

        const format = match.match_type; 
        await PlayerModel.updateMany(
        { _id: { $in: allPlayers } },
        { $inc: { [`player_statistics.${format}.matches_played`]: 1 } }
        );
        await match.save(); 

        for (const inningsid of match.innings){
            const innings=await InningsModel.findById(inningsid._id)
                            .populate("BattingScorecard")
                            .populate("BowlingScorecard");

            if (!innings) {
                return res.status(404).json({
                    success: false,
                    message: `Innings data missing for one of the innings in match ${match._id}`,
                });
                }

                for(const bat of innings.BattingScorecard){
                    const player=await PlayerModel.findById(bat.player_id);
                    if(!player){
                        return res.status(404).json({
                            success:false,
                            status:404,
                            message:`Player data missing for player ${bat.player_id}`
                        }) ; 
                    }
                    const player_match_summary=await PlayerMatchSummaryModel.findOne({
                        player_id:player._id,
                        match_id:match._id
                        });
                        if(!player_match_summary){
                            return res.status(404).json({
                                success:false,
                                status:404,
                                message:`Player match summary data missing for player ${player._id} in match ${match._id}`
                            });
                        }
                    player_match_summary.batting.runs=bat.Runs;
                    player_match_summary.batting.balls=bat.Balls;
                    player_match_summary.batting.fours=bat.Fours;
                    player_match_summary.batting.sixes=bat.Sixes;
                    player_match_summary.batting.dismissal_against=bat.Dismissal?._id;
                    player_match_summary.batting.batting_status=bat.Batting_status;
                    
                    
                    if(bat.Batting_status!=='not_batted'){
                        player.player_statistics[match.match_type].Innings_played+=1;
                        player_match_summary.is_innings_played=true;
                        if(bat.Batting_status!=='out'){
                            player.player_statistics[match.match_type].not_outs+=1;
                        }
                    }
                    player.player_statistics[match.match_type].runs+=bat.Runs; 
                    player.player_statistics[match.match_type].balls_faced+=bat.Balls;
                    player.player_statistics[match.match_type].fours+=bat.Fours;
                    player.player_statistics[match.match_type].sixes+=bat.Sixes;
                    player.player_statistics[match.match_type].highest_score=Math.max(player.player_statistics[match.match_type].highest_score,bat.Runs);
                    player.player_statistics[match.match_type].batting_average=player.player_statistics[match.match_type].runs/player.player_statistics[match.match_type].Innings_played;
                    player.player_statistics[match.match_type].strike_rate=((player.player_statistics[match.match_type].runs/player.player_statistics[match.match_type].balls_faced)*100).toFixed(2);
                    if(bat.Runs>=50 && bat.Runs<100){
                        player.player_statistics[match.match_type].fifties+=1;
                    }
                    if(bat.Runs>=100){
                        player.player_statistics[match.match_type].hundreds+=1;
                    }
                    if(bat.Runs>=200){
                        player.player_statistics[match.match_type].double_centuries+=1;
                    }
                    await Promise.all([player.save(),
                    player_match_summary.save()]);

                }
                for(const bowl of innings.BowlingScorecard){
                    const player=await PlayerModel.findById(bowl.bowler_id);
                    if(!player){
                        return res.status(404).json({
                            success:false,
                            status:404,
                            message:`Player data missing for player ${bowl.player_id}`
                        }) ; 
                    }
                    const player_match_summary=await PlayerMatchSummaryModel.findOne({
                        player_id:player._id,
                        match_id:match._id
                        });
                        if(!player_match_summary){
                            return res.status(404).json({
                                success:false,
                                status:404,
                                message:`Player match summary data missing for player ${player._id} in match ${match._id}`
                            });
                        }
                    player_match_summary.bowling.runs_conceded+=bowl.Runs;
                    player_match_summary.bowling.balls_bowled+=bowl.Balls;
                    player_match_summary.bowling.wickets+=bowl.Wickets;
                    player_match_summary.bowling.overs+=bowl.Overs;
                    player_match_summary.bowling.Maidens+=bowl.Maidens;
                    player_match_summary.bowling.dismissals.push(...bowl.Dismissal);
                    player.player_statistics[match.match_type].matches_played+=1;
                    player.player_statistics[match.match_type].runs_given+=bowl.Runs;
                    player.player_statistics[match.match_type].balls_bowled+=bowl.Balls;
                    player.player_statistics[match.match_type].wickets+=bowl.Wickets;
                    player.player_statistics[match.match_type].overs_bowled+=bowl.Overs;
                    player.player_statistics[format].bowling_average = player.player_statistics[format].wickets > 0
                    ? player.player_statistics[format].runs_given / player.player_statistics[format].wickets
                    : 0;
                    player.player_statistics[format].economy = player.player_statistics[format].overs_bowled > 0
                    ? player.player_statistics[format].runs_given / player.player_statistics[format].overs_bowled
                    : 0;
                    if(bowl.Wickets>=5 && bowl.Wickets<10){
                        player.player_statistics[match.match_type].five_wickets+=1;
                    }
                    if(bowl.Wickets>=10){
                        player.player_statistics[match.match_type].ten_wickets+=1;
                    }
                    if(player.player_statistics[match.match_type].best_bowling_figures.wickets<bowl.Wickets){
                        player.player_statistics[match.match_type].best_bowling_figures.wickets=bowl.Wickets;
                        player.player_statistics[match.match_type].best_bowling_figures.runs=bowl.Runs;
                    }
                    if(player.player_statistics[match.match_type].best_bowling_figures.wickets===bowl.Wickets){
                        if(player.player_statistics[match.match_type].best_bowling_figures.runs>bowl.Runs){
                            player.player_statistics[match.match_type].best_bowling_figures.runs=bowl.Runs;
                        }
                    };
                    const fielderInvolvedWickets=['caught','stumped','run_out','caught and bowled'];
                    for (const dismissal of bowl.Dismissal){
                            if(fielderInvolvedWickets.includes(dismissal.dismissal_type)){
                                const fielder=await PlayerModel.findById(dismissal.fielder_id);
                                const fielder_match_summary=await PlayerMatchSummaryModel.findOne({
                                    player_id:dismissal.fielder_id,
                                    match_id:match._id
                                })
                                if(dismissal.dismissal_type==="stumped"){
                                    fielder.player_statistics[match.match_type].stumpings+=1;
                                    fielder_match_summary.fielding.stumpings+=1;
                                }
                                else if(dismissal.dismissal_type==="run_out"){
                                    fielder.player_statistics[match.match_type].runouts+=1;
                                    fielder_match_summary.fielding.run_outs+=1;
                                }
                                else if(dismissal.dismissal_type==="caught"){
                                    fielder.player_statistics[match.match_type].catches+=1;
                                    fielder_match_summary.fielding.catches+=1;
                                }
                                await Promise.all([fielder.save(),
                                fielder_match_summary.save()]);
                            }
                    }

                    await Promise.all([ player.save(),
                    player_match_summary.save()]);
                }    
            innings.isCompleted = true;
            await innings.save();
            
        }
        return res.status(200).json({
            success:true,
            status:200,
            message:"Match completed successfully",
            data:match
        })

         }  
     catch (error) {
        return res.status(500).json({
            success:false,
            status:500,
            message:"Internal server error while completing the match",
            error:error.message
        })
    }
 
}
}
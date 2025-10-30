const BattingModel = require("../Models/BattingModel");
const InningsModel = require("../Models/InningsModel");
const MatchModel = require("../Models/MatchModel");

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
        let innings=await InningsModel.findOne({match_id:id})
                    .sort({createdAt:-1})
                    .populate("batting_team")
                    .populate("bowling_team")
                    .populate("BattingScorecard")
                    .populate("BowlingScorecard")


        if(!innings){
            const match=await MatchModel.findById(id);
            if(!match){
                return res.status(404).json({
                    success:false,
                    status:404,
                    message:"Match not found"
                })
            }
            innings=await InningsModel.create({
                match_id:id,
                battingTeam:match.battingFirstTeam,
                bowlingTeam:match.bowlingFirstTeam,
                Runs:0,
                Wickets:0,
                Overs:0.0,
                Balls:0,
                Extras:0,
                runRate:0,
                requiredRunRate:0,
                Boundaries:0,
                Sixes,
                BattingScorecard:[],
                BowlingScorecard:[]
            });

        }
        let Striker=await BattingModel.findOne({innings_id:innings._id,player_id:striker._id});
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
        let nonStriker=await BattingModel.findOne({innings_id:innings._id,player_id:non_striker._id});
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
        let Bowler=await BowlingModel.findOne({innings_id:innings._id,player_id:bowler._id});
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
        innings.Runs+=Number(runs)||0;
        Striker.Runs+=Number(runs)||0;
        Bowler.Runs+=Number(runs)||0;

        if(wicket){
        innings.Wickets+=Number(wicket)||0;
        if(wicketType!='runout'){
            Striker.Batting_status='out';
            Striker.Dismissal.DismissalType=wicketType;
            Bowler.Wickets+=Number(wicket)||0;
            Bowler.Dismissal.DismissalType=wicketType;
            Bowler.Dismissal.fielder=fielder._id;
        }
        else{
            if(run_out_player){
                if(run_out_player._id==striker._id){
                    Striker.Batting_status='out';
                    Striker.Dismissal.batsman._id=striker._id;
                    Striker.Dismissal.DismissalType=wicketType;
                    Striker.Dismissal.fielder=fielder._id;
                }else{
                    nonStriker.Batting_status='out';
                    Striker.Dismissal.batsman._id=run_out_player._id;
                    nonStriker.Dismissal.DismissalType=wicketType;
                    nonStriker.Dismissal.fielder=fielder._id;
                }
                Bowler.Dismissal.batsman._id=run_out_player._id;
                Bowler.Dismissal.bowler._id=bowler._id;
                Bowler.Dismissal.DismissalType=wicketType;
                Bowler.Dismissal.fielder=fielder._id;
            }
        }

        }
        if (!innings.Extras) {
        innings.Extras = { total: 0, wide: 0, noball: 0, bye: 0, legbye: 0 };
        }
        innings.Extras.total+=Number(extras)||0;
        if(extrasType){
            innings.Extras[extrasType]+=Number(extras)||0;
            if(extrasType!=="wide" && extrasType!=="noball"){
                innings.Balls+=1;
                Striker.Balls+=1;
                innings.Overs=Math.floor(innings.Balls/6)+(innings.Balls%6)/10;
            }

        }
        else{
            innings.Balls+=1;
            }
        innings.runRate=innings.Overs === 0 ? innings.Runs : (innings.Runs / innings.Overs).toFixed(2);
        innings.Boundaries+=Number(boundary)||0;
        innings.Sixes+=Number(sixer)||0;
        innings.save();


        Striker.StrikeRate=Striker.Runs/Striker.Balls;
        Striker.save();

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
        const match=await MatchModel.findById(id).populate(Inning);
        if(!match){
            return res.status(404).json({
                success:false,
                status:404,
                message:'Match not found',
            })
        }
        match.status='completed';
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
                    
                    player.player_statistics[match.Match_status].matches_played+=1;

                    if(bat.Batting_status!=='not_batted'){
                        player.player_statistics[match.Match_status].Innings_played+=1;
                        if(bat.Batting_status!=='out'){
                            player.player_statistics[match.Match_status].not_outs+=1;
                        }
                    }
                    player.player_statistics[match.Match_status].runs+=bat.Runs; 
                    player.player_statistics[match.Match_status].balls_faced+=bat.Balls;
                    player.player_statistics[match.Match_status].fours+=bat.Fours;
                    player.player_statistics[match.Match_status].sixes+=bat.Sixes;
                    player.player_statistics[match.Match_status].highest_score=Math.max(player.player_statistics[match.Match_status].highest_score,bat.Runs);
                    player.player_statistics[match.Match_status].batting_average=player.player_statistics[match.Match_status].runs/player.player_statistics[match.Match_status].Innings_played;
                    player.player_statistics[match.Match_status].strike_rate=((player.player_statistics[match.Match_status].runs/player.player_statistics[match.Match_status].balls_faced)*100).toFixed(2);
                    if(bat.Runs>=50 && bat.Runs<100){
                        player.player_statistics[match.Match_status].fifties+=1;
                    }
                    if(bat.Runs>=100){
                        player.player_statistics[match.Match_status].hundreds+=1;
                    }
                    if(bat.Runs>=200){
                        player.player_statistics[match.Match_status].double_centuries+=1;
                    }
                    await player.save();
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
                    player.player_statistics[match.Match_status].matches_played+=1;
                    player.player_statistics[match.Match_status].runs_given+=bowl.Runs;
                    player.player_statistics[match.Match_status].balls_bowled+=bowl.Balls;
                    player.player_statistics[match.Match_status].wickets+=bowl.Wickets;
                    player.player_statistics[match.Match_status].overs_bowled+=bowl.Overs;
                    player.player_statistics[match.Match_status].bowling_average=player.player_statistics[match.Match_status].runs_given/player.player_statistics[match.Match_status].wickets;
                    player.player_statistics[match.Match_status].economy=player.player_statistics[match.Match_status].runs_given/player.player_statistics[match.Match_status].overs_bowled;
                    if(bowl.Wickets>=5 && bowl.Wickets<10){
                        player.player_statistics[match.Match_status].five_wickets+=1;
                    }
                    if(bowl.Wickets>=10){
                        player.player_statistics[match.Match_status].ten_wickets+=1;
                    }
                    if(player.player_statistics[match.Match_status].best_bowling_figures.wickets<bowl.Wickets){
                        player.player_statistics[match.Match_status].best_bowling_figures.wickets=bowl.Wickets;
                        player.player_statistics[match.Match_status].best_bowling_figures.runs=bowl.Runs;
                    }
                    if(player.player_statistics[match.Match_status].best_bowling_figures.wickets===bowl.Wickets){
                        if(player.player_statistics[match.Match_status].best_bowling_figures.runs<bowl.Runs){
                            player.player_statistics[match.Match_status].best_bowling_figures.runs=bowl.Runs;
                        }
                    };
                    for (const dismissal of bowl.Dismissal){
                        fielderInvolvedWickets=['caught','stumped','run_out','caught and bowled'];
                            if(fielderInvolvedWickets.includes(dismissal.dismissal_type)){
                                const fielder=await PlayerModel.findById(dismissal.fielder_id);
                                if(dismissal.dismissal_type==="stumped"){
                                    fielder.player_statistics[match.Match_status].stumpings+=1;
                                }
                                else if(dismissal.dismissal_type==="run_out"){
                                    fielder.player_statistics[match.Match_status].runouts+=1;
                                }
                                else if(dismissal.dismissal_type==="caught"){
                                    fielder.player_statistics[match.Match_status].catches+=1;
                                }
                                await fielder.save();
                            }
                    }

                    await player.save();
                }    
            innings.isCompleted = true;
            await innings.save();
        }
        return res.status(200).json({
            succes:true,
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
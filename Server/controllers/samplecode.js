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
                    batting_status:'not_bowled'
                })
                await firstInnings_bowling_scorecard.save();
            }
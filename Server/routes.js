const { createTournament, createMatch } = require('./controllers/admincontroller');
const { login, UserRegister } = require('./controllers/login&controller');
const { getMatches, MatchDetails, getTournaments, getTournamentDetails, getTeams, getTeamDetails, getPlayers, getPlayerDetails } = require('./controllers/viewcontroller');
const router=require('express').Router()




router.post('/login',login);
router.post('/user/register',UserRegister);
router.get('/matches',getMatches);
router.get('/match/:id',MatchDetails);
router.get('tournaments',getTournaments);
router.get('tournament/:id',getTournamentDetails);
router.get('/teams',getTeams);
router.get('/team/:id',getTeamDetails);
router.get('/players',getPlayers);
router.get('/player/:id',getPlayerDetails);
router.post('/tournament/create',createTournament);
router.post('/match/create',createMatch);

 
module.exports=router;
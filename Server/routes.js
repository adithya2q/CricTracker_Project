const { createTournament, createMatch, updateMatchInfo } = require('./controllers/admincontroller');
const { login, UserRegister } = require('./controllers/login&controller');
const { updateMatchScore, switchInnings } = require('./controllers/scorercontroller');
const { getMatches, MatchDetails, getTournaments, getTournamentDetails, getTeams, getTeamDetails, getPlayers, getPlayerDetails, updateChat, getChat } = require('./controllers/viewcontroller');
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
router.patch('/match/update/:id',updateMatchInfo);
router.patch('match/updatescore/:id',updateMatchScore);
router.post('/match/switchinnings/:id',switchInnings);
router.post('/match/:id/uploadchat',updateChat);
router.get('/match/:id/chat',getChat);


 
module.exports=router;
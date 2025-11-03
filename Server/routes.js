const { createTournament, createMatch, updateMatchInfo } = require('./controllers/admincontroller');
const { login, UserRegister } = require('./controllers/login&controller');
const { updateMatchScore, switchInnings } = require('./controllers/scorercontroller');
const { getPlayerPerformance, savePlaying11 } = require('./controllers/teamManagerController');
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
router.patch('/match/:id/updateinfo',updateMatchInfo);
router.patch('match/updatescore/:id',updateMatchScore);
router.post('/match/switchinnings/:id',switchInnings);
router.post('/match/:id/uploadchat',updateChat);
router.get('/match/:id/chat',getChat);
router.get('player/:id/playerperformance',getPlayerPerformance);
router.post('/save/playing11',savePlaying11);
router.get('/get/PvsP',getPlayervsPlayerPerformance)


 
module.exports=router;
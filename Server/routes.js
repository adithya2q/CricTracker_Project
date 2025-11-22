const { createTournament, createMatch, updateMatchInfo, registerPlayers, registerTeams, getManagers, matchCompleted } = require('./controllers/admincontroller');
const { login, UserRegister } = require('./controllers/login&controller');
const { updateMatchScore, switchInnings, updateCommentary, matchScorecardComplete } = require('./controllers/scorercontroller');
const { getPlayerPerformance, savePlaying11, getPlayervsPlayerPerformance, getBatsmanVsBowlerPerformance, getTeamVsTeamPerformance, getPlayerVsTeamPerformance } = require('./controllers/teamManagerController');
const { getMatches, MatchDetails, getTournaments, getTournamentDetails, getTeams, getTeamDetails, getPlayers, getPlayerDetails, updateChat, getChat } = require('./controllers/viewcontroller');
const {authMiddleware} = require('./Middleware/authMiddleware');
const { authRoles }= require('./Middleware/authRoles');
const router=require('express').Router()




router.post('/login',login);
router.post('/user/register',UserRegister);
router.get('/matches',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),getMatches);
router.get('/match/:id',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),MatchDetails);
router.get('/tournaments',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),getTournaments);
router.get('/tournament/:id',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),getTournamentDetails);
router.get('/teams',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),getTeams);
router.get('/team/:id',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),getTeamDetails);
router.get('/players',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),getPlayers);
router.get('/player/:id',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),getPlayerDetails);
router.get('/managers',authMiddleware,authRoles('admin'),getManagers);
router.post('/player/register',authMiddleware,authRoles('admin'),registerPlayers);
router.post('/team/register',authMiddleware,authRoles('admin'),registerTeams);
router.post('/tournament/create',authMiddleware,authRoles('admin'),createTournament);
router.post('/match/create',authMiddleware,authRoles('admin'),createMatch);
router.patch('/match/:id/updateinfo',authMiddleware,authRoles('admin','scorer'),updateMatchInfo);
router.post('/match/:id/scorecared/complete',authMiddleware,authRoles('admin','scorer'),matchScorecardComplete);
router.post('/match/:matchId/complete',authMiddleware,authRoles('admin','scorer'),matchCompleted);
router.patch('/match/:id/updatecommentary',authMiddleware,authRoles('admin','scorer'),updateCommentary);
router.patch('/match/:id/updatescore',authMiddleware,authRoles('admin','scorer'),updateMatchScore);
router.post('/match/:id/switchinnings',authMiddleware,authRoles('admin','scorer'),switchInnings);
router.post('/match/:id/uploadchat',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),updateChat);
router.get('/match/:id/chat',authMiddleware,authRoles('viewer', 'admin', 'teamManager', 'scorer'),getChat);
router.get('/player/:targetId/playerperformance',authMiddleware,authRoles( 'admin', 'teamManager'),getPlayerPerformance);
router.post('/save/playing11',authMiddleware,authRoles( 'admin', 'teamManager'),savePlaying11);
router.get('/get/PvsP',authMiddleware,authRoles( 'admin', 'teamManager'),getPlayervsPlayerPerformance);
router.get('/get/BvsB',authMiddleware,authRoles( 'admin', 'teamManager'),getBatsmanVsBowlerPerformance);
router.get('/get/TvsT',authMiddleware,authRoles( 'admin', 'teamManager'),getTeamVsTeamPerformance);
router.get('/get/playerVsTeam',authMiddleware,authRoles( 'admin', 'teamManager'),getPlayerVsTeamPerformance);



 
module.exports=router;
const { login, UserRegister } = require('./controllers/login&controller');
const { getMatches, MatchDetails } = require('./controllers/usercontroller');

const router=require('express').Router()




router.post('/login',login);
router.post('/user/register',UserRegister);
router.get('/matches',getMatches);
router.get('/match/:id',MatchDetails);



module.exports=router;
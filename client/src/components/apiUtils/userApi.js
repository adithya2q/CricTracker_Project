import axiosInstance from "../Config/axiosconfig";


export const userLogin=async(payload)=>{
    const {email,password,role}=payload;
    if(email && password && role){
        const result=await axiosInstance.post('/login',payload);
        console.log(result);
        return result.data;
    }
    else{
        return false;
    }
}
 
export const userRegister=async(payload)=>{
    const {name,phone,email,password,confirmPassword,role}=payload;
    if(name && phone && email && password && confirmPassword && role){
        const result=await axiosInstance.post('/user/register',payload);
        return result.data;
    }
    else{
        return false;
    }
}

export const getMatches=async()=>{
    const result=await axiosInstance.get('/matches');
    return result.data;
}


export const getMatchDetails=async(id)=>{
    const result=await axiosInstance.get(`/match/${id}`);
    console.log("result",result);
    return result.data;
}

export const getTournaments=async()=>{
    const result=await axiosInstance.get('/tournaments');
    return result.data;
}

export const getTournamentDetails=async(id)=>{
    const result=await axiosInstance.get(`/tournament/${id}`);
    return result.data;
}

export const getTeams=async()=>{
    const result=await axiosInstance.get('/teams');
    return result.data
}

export const getTeamDetails=async(id)=>{
    const result=await axiosInstance.get(`/team/${id}`);
    return result.data;
}

export const getPlayers=async()=>{
    const result=await axiosInstance.get('/players');
    console.log(result);
    return result.data;
}

export const registerPlayer=async(payload)=>{
    const result=await axiosInstance.post('/player/register',payload);
    return result.data;
}

export const registerTeam=async(payload)=>{
    const result = await axiosInstance.post('/team/register',payload);
    return result.data;
}

export const getManagers=async()=>{
    const result=await axiosInstance.get('/managers');
    return result.data;
}

export const getPlayerDetails=async(id)=>{
    const result=await axiosInstance.get(`/player/${id}`);
    return result.data;
}

export const createTournament=async(payload)=>{
    const {tournament_name,tournament_type,tournament_teams,tournament_venues,tournament_start_date,tournament_end_date,tournament_image}=payload;
    if(!tournament_name || !tournament_type || !tournament_teams || !tournament_venues || !tournament_start_date || !tournament_end_date || !tournament_image){
        return ({success:false,status:400,message:"All fields are required"});
    }
    const result=await axiosInstance.post('/tournament/create',payload);
    return result.data;
}

export const createMatch=async(payload)=>{
    const {match_category,tournamentId ,team1Id,team2Id,match_type,venue,date}=payload;
    if(!match_category || !tournamentId || !team1Id || !team2Id || !match_type || !venue || !date){
        return false;
    }
    const result=await axiosInstance.post('/match/create',payload);
    return result.data;
}

export const updateMatchInfo=async(id,payload)=>{
    if(!id){
        return false;
    }
    const result=await axiosInstance.patch(`/match/${id}/updateinfo`,payload);
    return result.data;
}

export const matchcompleted=async(matchId,payload)=>{
    if(!matchId){
        return false;
    }
    const result=await axiosInstance.post(`/match/${matchId}/complete`,payload);
    return result.data;
}

export const updateCommentary=async(id,payload)=>{
    if(!id){
        return false;
    }
    console.log(payload);
    const result=await axiosInstance.patch(`/match/${id}/updatecommentary`,payload);
    return result.data;
}

export const uploadChat=async(id,payload)=>{
    if(!id){
        return false;
    }
    const result=await axiosInstance.post(`/match/${id}/uploadchat`,payload);
    return result.data;
}

export const getChat=async(id)=>{
    if(!id){
        return false;
    }
    const result=await axiosInstance.get(`/match/${id}/chat`);
    return result.data;
}

export const updateScore=async(id,payload)=>{
    if(!id){
        return false;
    }
    const result=await axiosInstance.patch(`/match/${id}/updatescore`,payload);
    return result.data;
}

export const switchInnings=async(id)=>{
    if(!id){
        return false;
    }
    const result=await axiosInstance.post(`/match/${id}/switchinnings`);
    console.log(result);
    return result.data;
}

export const completeScorecard=async(id)=>{
    if(!id){
        return false;
    }
    const result=await axiosInstance.post(`/match/${id}/scorecared/complete`);
    return result.data;
}

export const getPlayerPerformance=async(id,payload)=>{
    const targetId = id || payload?.player_id;
    if (!targetId) {
        console.error("API Aborted: No Player ID found.");
        return false;
    }
    const {format,limit}=payload;
    const result=await axiosInstance.get(`/player/${targetId}/playerperformance?format=${format}&limit=${limit}`);
    return result.data;
}

export const savePlaying11=async(payload)=>{
    const {team_id,players,captain,wicketKeeper,viceCaptain}=payload;
    if(!team_id || !players || !captain || !wicketKeeper || !viceCaptain){
        return false;
    }
    const result=await axiosInstance.post('/save/playing11',payload);
    return result.data;
}

export const getPvsP=async(payload)=>{
    const {player1,player2,match_type,limit}=payload;
    if(!player1||!player2){
        return false;
    }
    const result=await axiosInstance.get('/get/PvsP',{params:{player1,player2,match_type,limit}});    
    return result.data;
}

export const getBatsmanVsBowler=async(payload)=>{
    const {player1,player2,match_type,limit}=payload;
    if(!player1||!player2){
        return false;
    }
    const result=await axiosInstance.get('/get/BvsB',{params:{player1,player2,match_type,limit}});    
    return result.data;
}

export const getTeamVsTeam=async(payload)=>{
    const {team1,team2,match_type,limit}=payload;
    if(!team1||!team2){
        return false;
    }
    const result=await axiosInstance.get('/get/TvsT',{params:{team1,team2,match_type,limit}});    
    return result.data;
}

export const getPlayerVsTeam=async(payload)=>{
    const {player,team,match_type,limit}=payload;
    if(!player||!team){
        return false;
    }
    const result=await axiosInstance.get('/get/playerVsTeam',{params:{player,team,match_type,limit}});    
    return result.data;
}





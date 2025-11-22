import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import LoginPage from "./components/Login";
import Register from "./components/Register";
import MatchDetails from "./components/MatchDetails";
import MatchCenter from "./components/MatchCenter";
import Tournaments from "./components/Tournaments";
import Teams from "./components/Teams";
import TeamDetails from "./components/TeamDetails";
import Players from "./components/Players";
import PlayerDetails from "./components/PlayerDetails";
import CreateMatch from "./components/CreateMatch";
import CreateTournament from "./components/CreateTournament";
import Tournament from "./components/Tournament";
import UpdateMatch from "./components/UpdateMatch";
import ReportsAndManagement from "./components/ReportsAndManagement";
import PlayerRegister from "./components/PlayerRegister";
import TeamRegister from "./components/TeamRegister";


const isAuthenticated=()=>{
    const token=localStorage.getItem('token');
    const user=localStorage.getItem('loggedInId');
    if(token&&user){
        return true;
    }
    else{
        return false;
    }
}

const ProtectedRoute=({element})=>{
  return isAuthenticated()? element : <Navigate to="/login" />;
}

const FallbackRoute=({element})=>{
  return isAuthenticated()? <Navigate to="/" /> : <Navigate to="/login" />;
}


const router=createBrowserRouter([
{
    path:'/',
    element:<Layout/>,
    children:[
        {index:true,element:<ProtectedRoute element={<Home />}/>},
        {path:'matches',element:<ProtectedRoute element={<MatchCenter />} />},
        {path:'match/:id',element:<ProtectedRoute element={<MatchDetails />} />},
        {path:'tournaments',element:<ProtectedRoute element={<Tournaments />} />},
        {path:'tournament/:id',element:<ProtectedRoute element={<Tournament />} />},
        {path:'teams',element:<ProtectedRoute element={<Teams />}/>},
        {path:'team/:id',element:<ProtectedRoute element={<TeamDetails />} />},
        {path:'team/register',element:<ProtectedRoute element={<TeamRegister />} />},
        {path:'players',element:<ProtectedRoute element={<Players />}/>},
        {path:'player/register',element:<ProtectedRoute element={<PlayerRegister />}/>},
        {path:'player/:id',element:<ProtectedRoute element={<PlayerDetails />}/>},
        {path:'tournament/create',element:<ProtectedRoute element={<CreateTournament />}/>},
        {path:'tournament/:id/match/create',element:<ProtectedRoute element={<CreateMatch />}/>},
        {path:'matches/match/create',element:<ProtectedRoute element={<CreateMatch />}/>},
        {path:'matches/match/:id/update',element:<ProtectedRoute element={<UpdateMatch />}/>},
        {path:'reportsAndManagement',element:<ProtectedRoute element={<ReportsAndManagement />}/>},
    ]
},
{
    path:'/login',
    element:<LoginPage />
},
{
    path:'/user/register',
    element:<Register />
},
{
    path:'*',
    element:<FallbackRoute/>
}
])

export default router;
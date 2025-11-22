import React, { useState } from 'react'
import { useEffect } from 'react'
import {useNavigate, useParams } from 'react-router-dom';
import { createMatch, getTeams, getTournaments } from '../apiUtils/userApi';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
const CreateMatch = () => {
    const navigate=useNavigate();
    const {tournamentID}=useParams();
    const [loading,setLoading]=useState(true);
    const [tournaments,setTournaments]=useState([]);
    const [teams, setTeams]=useState([]);
    const [formData,setFormData]=useState({
      match_category:'',
      tournamentId:'',
      team1Id:'',
      team2Id:'',
      match_type:'',
      venue:'',
      date:'',
    });
    useEffect(()=>{
        const token=localStorage.getItem('token')
        console.log("token",token)
        const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
        const role=decodedToken.role;
        console.log("role",role)
        if(!token || role!=='admin'){
            navigate('/login');
        }
        const fetchDetails=async()=>{
            try{
              const response=await getTournaments();
              const response2=await getTeams();
              if(response && response.success && response2 && response2.success){
                setTournaments(response.data);
                setTeams(response2.data);
              }
              if(tournamentID){
                setFormData((formData)=>({...formData,match_category:'tournament',tournamentId:tournamentID}));
              }
            }
            catch(error){
                console.log("error fetching tournaments",error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchDetails();
    },[])

    const handleEventChange=(e)=>{
      const {name,value}=e.target;
      setFormData((formData)=>({...formData,[name]:value}));
    }

    const handleSubmit=async(e)=>{
      e.preventDefault();
      const SentData=await createMatch(formData);
      console.log("Match data ",SentData);
      if(SentData && SentData.success){
        toast("Match created successfully");
        navigate('/matches');
      }
    }


  return (
    <div>
        <h1>Create Match</h1>
         <Form onSubmit={handleSubmit}>
         <Form.Group >
          <Form.Label>Match Category</Form.Label>
          <Form.Select
          name='match_category' 
          value={formData.match_category}
          onChange={handleEventChange}
          disabled={!!tournamentID}>
            <option value=''>Select match category</option>
            <option value='tournament'>Tournament</option>
            <option value='friendly'>Friendly</option>
          </Form.Select>
          </Form.Group>

        {formData.match_category==='tournament' &&
          <Form.Group>
          <Form.Label>Select Tournament</Form.Label>
          <Form.Select
          name='tournamentId'
          value={formData.tournamentId}
          onChange={handleEventChange}
          disabled={!!tournamentID}>
            <option value=''>Select tournament</option>
            {tournaments.map((tournament)=>(
              <option key={tournament._id} value={tournament._id}>{tournament.tournament_name}</option>
            ))}
          </Form.Select>
          </Form.Group>}

          <Form.Group>
          <Form.Label>Select Team 1</Form.Label>
          <Form.Select
          name='team1Id'
          value={formData.team1Id}
          onChange={handleEventChange}>
            <option>Select team</option>
            {teams.map((team)=>(
              <option key={team._id} value={team._id}>{team.team_name}</option>
            ))}
          </Form.Select>
          </Form.Group>

          <Form.Group>
          <Form.Label>Select Team 2</Form.Label>
          <Form.Select
          name='team2Id'
          value={formData.team2Id}
          onChange={handleEventChange}>
            <option>Select team</option>
            {teams.map((team)=>(
              <option key={team._id} value={team._id}>{team.team_name}</option>
            ))}
          </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Match Type</Form.Label>
              <Form.Select aria-label="Default select example"
              name="match_type" 
              value={formData.match_type} 
              onChange={handleEventChange}>
                <option value="">Select match type</option>
                <option value="T20I">T20</option>
                <option value="ODI">ODI</option>
                <option value="TestI">Test</option>
                <option value="Domestic_T20">Domestic T20</option>
                <option value="Domestic_OD">Domestic OD</option>
                <option value="Domestic_Test">Domestic Test</option>

              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Control type="text" name="venue" value={formData.venue} onChange={handleEventChange} />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="text" name="date" value={formData.date} onChange={handleEventChange} />
            </Form.Group>

          <div className="text-center">
            <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Create Match"}
            </Button>
        </div>


        </Form>


        
        
      
    </div>
  )
}

export default CreateMatch

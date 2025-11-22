import React, { useEffect, useState } from 'react'
import { getTeams, registerPlayer } from '../apiUtils/userApi';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';
import Select from 'react-select';


const PlayerRegister = () => {
    const navigate=useNavigate();
    const [teams,setTeams]=useState([]);
    const [loading,setLoading]=useState(true);
    const [formData,setFormData]=useState({
        player_name:'',
        player_DOB:'',
        player_nationality:'',
        player_age:0,
        player_role:'',
        player_batting_style:'',
        player_bowling_style:'',
        player_teams:[],
        player_image:'',
    });

    useEffect(() => {
        const token=localStorage.getItem('token')
        const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
        const role=decodedToken.role;
        if(!token || role!=='admin'){
            navigate('/login');
        }
        const fetchTeams=async()=>{
            try {
                const response=await getTeams();
                if(response && response.success){
                    setTeams(response.data);
                }
                
            } catch (error) {
                console.error("error fetching teams",error)
            }
            finally{
                setLoading(false);
            }
            
        }
        fetchTeams();
    },[]);

    const handleEventChange=(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
    }

    const teamOptions=teams.map((team)=>({
        value:team._id,
        label:team.team_name
    }));

    const handleReactSelectChange=(selectedOptions)=>{
         const selectedTeams=selectedOptions.map((option)=>option.value);
         setFormData((formData)=>({...formData,player_teams:selectedTeams}));
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log("Player data ",formData);
        const Sentdata=await registerPlayer(formData);
        if(Sentdata && Sentdata.success){
            toast("Player registered successfully");
            navigate('/players');
        }
    }

  return (
    <div>
         <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Player Name</Form.Label>
                <Form.Control type="text"
                name="player_name" 
                value={formData.player_name} 
                onChange={handleEventChange}
                required
                placeholder="Enter player name" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Player DOB</Form.Label>
                <Form.Control type="text"
                name="player_DOB" 
                value={formData.player_DOB} 
                onChange={handleEventChange}
                required
                placeholder="DD/MM/YYYY"/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Player Nationality</Form.Label>
                <Form.Control type="text"
                name="player_nationality" 
                value={formData.player_nationality} 
                onChange={handleEventChange}
                required
                placeholder="Enter player name" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Player Age</Form.Label>
                <Form.Control type="number"
                name="player_age" 
                value={formData.player_age} 
                onChange={handleEventChange}
                required
                placeholder="Enter player name" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Player Role</Form.Label>
                <Form.Select type="text"
                name="player_role" 
                value={formData.player_role} 
                onChange={handleEventChange}
                required
                >
                    <option value=''>Select Player Role</option>
                    <option value='Batsman'>Batsman</option>
                    <option value='Bowler'>Bowler</option>
                    <option value='All Rounder'>All Rounder</option>
                    <option value='Wicket Keeper'>Wicket Keeper</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Player Batting Style</Form.Label>
                <Form.Control type="text"
                name="player_batting_style" 
                value={formData.player_batting_style} 
                onChange={handleEventChange}
                required
                placeholder="Enter player batting style" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Player Bowling Style</Form.Label>
                <Form.Control type="text"
                name="player_bowling_style" 
                value={formData.player_bowling_style} 
                onChange={handleEventChange}
                required
                placeholder="Enter player bowling style" />
            </Form.Group>


            <Form.Group className="mb-3">
                <Form.Label>Player Teams</Form.Label>
                <Select 
                isMulti
                options={teamOptions}
                value={teamOptions.filter((option) => formData.player_teams.includes(option.value))}
                onChange={handleReactSelectChange}
                placeholder="Select Teams"
                closeMenuOnSelect={false}
                ></Select>
                <Form.Text className='text-muted'>Type to search,click to select/deselect</Form.Text>

            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Player Image</Form.Label>
                <Form.Control type="text"
                name="player_image" 
                value={formData.player_image} 
                onChange={handleEventChange}
                required
                placeholder="Eg:https://example.com/image.jpg" />
            </Form.Group>

            <div className="text-center">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Register Player"}
          </Button>
        </div>
            </Form>
      
    </div>
  )
}

export default PlayerRegister

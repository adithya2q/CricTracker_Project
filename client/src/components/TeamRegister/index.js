import React, { useEffect, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getManagers, getPlayers, registerTeam } from '../apiUtils/userApi';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const TeamRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [managers,setManagers]=useState([]);
    const [formData,setFormData]=useState({
        team_name:null,
        team_logo:null,
        team_captain:null,
        team_viceCaptain:null,
        team_wicketkeeper:null,
        team_manager:null,
        team_players:[],
        team_home:null,
        team_description:null,
    });

    useEffect(()=>{
        const token=localStorage.getItem('token')
        const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
        const role=decodedToken.role;
        if(!token || role!=='admin'){
            navigate('/login');
        }

        const fetchPlayers=async()=>{
            try {
                const response=await getPlayers();
                const response2=await getManagers();
                if(response && response.success){
                    setPlayers(response.data);
                }
                if(response2 && response2.success){
                    setManagers(response2.data);
                }
            } catch (error) {
                console.error("error fetching players",error)
            }
            finally{
                setLoading(false);
            }
        }
        fetchPlayers();
    },[])

     const handleEventChange=(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
    }

    const playerOptions=players.map((player)=>({
        value:player._id,
        label:player.player_name
    }));

    const handleReactSelectChange=(selectedOptions)=>{
         const selectedPlayers=selectedOptions.map((option)=>option.value);
         setFormData((formData)=>({...formData,team_players:selectedPlayers}));
    }


    const handleSubmit=async(e)=>{
            e.preventDefault();
            console.log("team data ",formData);
            const Sentdata=await registerTeam(formData);
            if(Sentdata && Sentdata.success){
                toast("Team registered successfully");
                navigate('/teams');
            }
        }


  return (
    <div>
         <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Team Name</Form.Label>
                <Form.Control type="text"
                name="team_name" 
                value={formData.team_name} 
                onChange={handleEventChange}
                required
                placeholder="Enter team name" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Team logo</Form.Label>
                <Form.Control type="text"
                name="team_logo" 
                value={formData.team_logo} 
                onChange={handleEventChange}
                placeholder="Eg:https://example.com/image.jpg" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Team Captain</Form.Label>
                <Form.Select type="text"
                name="team_manager" 
                value={formData.team_captain} 
                onChange={handleEventChange}
                >
                    <option value={null}>Select Team Captain</option>
                    {players.map((player)=>(<option value={player._id}>{player.player_name}</option>))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Team Vice Captain</Form.Label>
                <Form.Select type="text"
                name="team_viceCaptain" 
                value={formData.team_viceCaptain} 
                onChange={handleEventChange}
                >
                    <option value={null}>Select Team Vice Captain</option>
                    {players.map((player)=>(<option value={player._id}>{player.player_name}</option>))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Team WicketKeeper</Form.Label>
                <Form.Select type="text"
                name="team_manager" 
                value={formData.team_wicketkeeper} 
                onChange={handleEventChange}
                >
                    <option value={null}>Select Wicket Keeper</option>
                    {players.map((player)=>(<option value={player._id}>{player.player_name}</option>))}
                </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3">
                <Form.Label>Add Players</Form.Label>
                <Select 
                isMulti
                options={playerOptions}
                value={playerOptions.filter((option) => formData.team_players.includes(option.value))}
                onChange={handleReactSelectChange}
                placeholder="Select players"
                closeMenuOnSelect={false}
                ></Select>
                <Form.Text className='text-muted'>Type to search,click to select/deselect</Form.Text>

            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Team Manager</Form.Label>
                <Form.Select type="text"
                name="team_manager" 
                value={formData.team_manager} 
                onChange={handleEventChange}
                >
                    <option value=''>Select team Manager</option>
                    {managers.map((manager)=>(<option value={manager._id}>{manager.manager_name}</option>))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Team Home Venue</Form.Label>
                <Form.Control type="text"
                name="team_home" 
                value={formData.team_home} 
                onChange={handleEventChange}
                placeholder="Enter home venue" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Team Description</Form.Label>
                <Form.Control type="text"
                name="team_description" 
                value={formData.team_description} 
                onChange={handleEventChange}
                placeholder="Enter team_description" />
            </Form.Group>


            <div className="text-center">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Register Team"}
          </Button>
        </div>
            </Form>
      
    </div>
  )
}

export default TeamRegister

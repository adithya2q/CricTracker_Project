import React from 'react'
import Select from 'react-select';
import { createTournament, getTeams } from '../apiUtils/userApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';


const CreateTournament = () => {
    const [loading,setloading]=useState(true);
    const [teams,setTeams]=useState([]);
    const [formData,setFormData]=useState({
        tournament_name:'',
        tournament_type:'',
        tournament_teams:[],
        tournament_venues:[''],
        tournament_matches:[],
        tournament_start_date: "",
        tournament_end_date: "",
        tournament_image: "",
    });

    const navigate=useNavigate();


    useEffect(()=>{
        const token=localStorage.getItem('token')
        console.log("token",token)
        const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
        const role=decodedToken.role;
        console.log("role",role)
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
                setloading(false);
            }
        }
        fetchTeams();
    },[])

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData((formData)=>({...formData,[name]:value}));
    }

    const teamOptions=teams.map((team)=>({
        value:team._id,
        label:team.team_name
    }));

    const handleReactSelectChange=(selectedOptions)=>{
         const selectedTeams=selectedOptions.map((option)=>option.value);
         setFormData((formData)=>({...formData,tournament_teams:selectedTeams}));
    }

    const handleAddVenue = () => {
    setFormData((prev) => ({
      ...prev,
      tournament_venues: [...prev.tournament_venues, ""],
        }));
      };
    
     const handleVenueChange = (index,value) => {
        const updatedVenues = [...formData.tournament_venues];
        updatedVenues[index] = value;
        setFormData((prev) => ({
          ...prev,
          tournament_venues: updatedVenues,
        }));
      };
    
      const handleRemoveVenue = (index) => {
        const updatedVenues = [...formData.tournament_venues];
        updatedVenues.splice(index, 1);
        setFormData((prev) => ({
          ...prev,
          tournament_venues: updatedVenues,
        }));
      };

      const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log("Tournament data ",formData);
        const Sentdata=await createTournament(formData);
        console.log(Sentdata);
        if(Sentdata && Sentdata.success){
            toast("Tournament created successfully");
            navigate('/tournaments');
        }

      }

  return (
    <div>
        <h1>Create Tournament</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Tournament Name</Form.Label>
                <Form.Control type="text"
                name="tournament_name" 
                value={formData.name} 
                onChange={handleChange}
                required
                placeholder="Enter tournament name" />
            </Form.Group>

                        <Form.Group className="mb-3">
                <Form.Label>Tournament Type</Form.Label>
                <Form.Select aria-label="Default select example"
                name="tournament_type" 
                value={formData.tournament_type} 
                onChange={handleChange}>
            <option value="">Select Tournament Type</option>
            <option value="T20">T20</option>
            <option value="ODI">ODI</option>
            <option value="Test">Test</option>
            <option value="Domestic T20">Domestic T20</option>
            <option value="Domestic OD">Domestic OD</option>
            <option value="Domestic Test">Domestic Test</option>
            </Form.Select>
            </Form.Group>
      
            <Form.Group className="mb-3">
                <Form.Label>Tournament Teams</Form.Label>
                <Select 
                isMulti
                options={teamOptions}
                value={teamOptions.filter((option) => formData.tournament_teams.includes(option.value))}
                onChange={handleReactSelectChange}
                placeholder="Select Teams"
                closeMenuOnSelect={false}
                ></Select>
                <Form.Text className='text-muted'>Type to search,click to select/deselect</Form.Text>

            </Form.Group>


                    <Form.Group className="mb-3">
                <Form.Label>Tournament Venues</Form.Label>
                {formData.tournament_venues.map((venue,index)=>(<Row key={index} className="mb-3"> 
                    <Col sm={9}>
               <Form.Control type="text"
                name="tournament_venues" 
                value={venue} 
                onChange={(e)=>handleVenueChange(index,e.target.value)}
                required
                placeholder="Enter venue name" /></Col>
                <Col sm={3}>
                {index===formData.tournament_venues.length-1 && (
                    <>
                <Button variant="primary" onClick={handleAddVenue}>Add Venue</Button>
                <Button variant="danger" onClick={()=>handleRemoveVenue(index)}>Remove Venue</Button>
                </>)}
                </Col>
                </Row>))}
            </Form.Group>

            <Row>
                <Col>
            <Form.Group className="mb-3">
                <Form.Label>Tournament Start Date</Form.Label>
                <Form.Control type="text"
                name="tournament_start_date" 
                value={formData.tournament_start_date} 
                onChange={handleChange}
                required
                placeholder="DD/MM/YYYY" />
            </Form.Group>
                </Col>
                <Col>
            <Form.Group className="mb-3">
                <Form.Label>Tournament End Date</Form.Label>
                <Form.Control type="text"
                name="tournament_end_date" 
                value={formData.tournament_end_date} 
                onChange={handleChange}
                required
                placeholder="DD/MM/YYYY" />
            </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Tournament Image</Form.Label>
                <Form.Control type="text"
                name="tournament_image" 
                value={formData.tournament_image} 
                onChange={handleChange}
                required
                placeholder="Eg:https://example.com/image.jpg" />
            </Form.Group>

        <div className="text-center">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Create Tournament"}
          </Button>
        </div>

        </Form>


      
    </div>
  )
}

export default CreateTournament

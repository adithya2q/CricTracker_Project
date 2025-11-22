import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, ListGroup, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getTeamDetails, savePlaying11 } from '../apiUtils/userApi';
import  {useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Playing11Selection = () => {
    const[teamId,setTeamId]=useState();
    const[loading,setLoading]=useState(true);
    const [players,setPlayers]=useState([]);
    const [playing11,setPlaying11]=useState([]);
    const navigate=useNavigate();
    const [formdata,setFormData]=useState({
        captain:'',
        viceCaptain:'',
        wicketKeeper:'',

    });

    useEffect(()=>{
    const token=localStorage.getItem('token')
    const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
    const role=decodedToken.role;
    if(!token || role!=='teamManager'){
        navigate('/login');
    }
    const storedId=localStorage.getItem('team_id');
    const getTeamPlayers=async()=>{
        try {
            
            const response=await getTeamDetails(storedId);
            console.log(response);
            if(response && response.success){
                const playing11Ids = new Set(response.data.playing11.filter(p => p&&p._id).map(p => p._id.toString()));
                console.log(playing11Ids);
                const availablePlayers = response.data.team_players.filter(p => !playing11Ids.has(p._id.toString()));
                const playing11Players = response.data.team_players.filter(p =>
          playing11Ids.has(p._id.toString())
        );
                setPlaying11(playing11Players);
                setPlayers(availablePlayers);

            }
            setTeamId(storedId);
        } catch (error) {
            console.error("error fetching players",error)
        }
        finally{
            setLoading(false);
        }
    }
        getTeamPlayers();
    },[])

    const addToPlaying11 = (player) => {
    setPlaying11(prevPlaying => {
        if (prevPlaying.find(p => p._id === player._id)) {
            toast("Player already selected");
            return prevPlaying;
        }
        if (prevPlaying.length >= 11) {
            toast("You can select only 11 players");
            return prevPlaying;
        }
        setPlayers(prevPlayers => prevPlayers.filter(p => p._id !== player._id));
        return [...prevPlaying, player];
    });
    };


    const removeFromPlaying11 = (player) => {
    setPlaying11(prevPlaying => prevPlaying.filter(p => p._id !== player._id));
    setPlayers(prevPlayers => [...prevPlayers, player]);
    };

    const handleEventChange=async(e)=>{
        const {name,value}=e.target;
        setFormData({...formdata,[name]:value});
    }

    const handleFormSubmit=async(e)=>{
        e.preventDefault();
        if(playing11.length!==11){
            toast("Required exactly 11 players");
            return;
        }
        if (!formdata.captain || !formdata.viceCaptain || !formdata.wicketKeeper) {
            toast("Please select Captain, Vice Captain, and Wicket Keeper");
             return;
        }
        const payload={
            team_id:teamId,
            players:playing11.map(player=>player._id),
            ...formdata
        }
        try {
            const response=await savePlaying11(payload);
            if(response && response.success){
                toast("Playing11 updated successfully");
            }
        } catch (error) {
            console.error("error creating team",error)
        }
    }

  return (
    <div>
        {loading?<Spinner animation="border" variant="primary" />:
        <>
        <Row>
            <Col md={6}>
            <Card className='shadow-sm rounded'>
                <Card.Header className="bg-primary text-white">
                    Available Players({players.length})
                </Card.Header>
                <Card.Body>
                    <ListGroup variant='flush'>
                        {players.map(player=>(
                    <ListGroup.Item
                    key={player._id}
                    className="d-flex justify-content-between align-items-center">
                          <span><Card.Img style={{width:"10rem", height:'10rem', objectFit:'cover'}} className="img-fluid passport-photo" variant="top" src={player.player_image}  /> <strong>{player.player_name}</strong>
                          </span> <span>{player.player_role}</span>
                          <Button variant="success" size="sm" onClick={()=>addToPlaying11(player)}>Add</Button></ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
            </Col>
            <Col md={6}>
            <Card>
                <Card.Header className="bg-primary text-white">
                    Playing 11
                </Card.Header>
                <Card.Body>
                    <ListGroup variant='flush'>
                        {playing11.map(player=>(
                    <ListGroup.Item
                    key={player._id}
                    className="d-flex justify-content-between align-items-center">
                     <span><Card.Img style={{width:"10rem", height:'10rem', objectFit:'cover'}} className="img-fluid passport-photo" variant="top" src={player.player_image}/> <strong>{player.player_name}</strong>
                          </span> <span>{player.player_role}</span>
                          <Button variant="danger" size="sm" onClick={()=>removeFromPlaying11(player)}>Remove</Button></ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        <Form onSubmit={handleFormSubmit}>
            <Form.Group>
                <Form.Select 
                name="captain"
                value={formdata.captain}
                onChange={handleEventChange}>
                    <option value=''>Select Captain</option>
                    {playing11.map(player=>(
                        <option key={player._id} value={player._id}>{player.player_name}</option>
                    ))}
                </Form.Select>
            </Form.Group>

        <Form.Group>
            <Form.Select
            name='viceCaptain'
            value={formdata.viceCaptain}
            onChange={handleEventChange}>
                <option value=''>Select Vice Captain</option>
                {playing11.map(player=>(
                    <option key={player._id} value={player._id}>{player.player_name}</option>
                ))}
            </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Select
                name='wicketKeeper'
                value={formdata.wicketKeeper}
                onChange={handleEventChange}>
                    <option value=''>Select Wicket Keeper</option>
                    {playing11.map(player=>(
                        <option key={player._id} value={player._id}>{player.player_name}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Button type="submit" variant="danger" size="sm">Save Playing11</Button>

        </Form>
        
        </>
        }

      
    </div>
  )
}

export default Playing11Selection

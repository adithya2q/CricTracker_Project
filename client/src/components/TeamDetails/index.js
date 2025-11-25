    import React, { useEffect, useState } from 'react'
    import { Col, Image, ListGroup, Row, Spinner } from 'react-bootstrap';
    import { useParams } from 'react-router-dom';
    import { getTeamDetails } from '../apiUtils/userApi';

    const TeamDetails = () => {
        const {id}=useParams();
        const [team,setTeam]=useState(null);
        const [loading,setLoading]=useState(true);


useEffect(()=>{
    const fetchTeamDetails=async()=>{
    try {
        const response=await getTeamDetails(id);
        if(response && response.success){
            setTeam(response.data);
        }
    } 
    catch (error) {
        console.error("error fetching team",error)
    }
    finally{
        setLoading(false);
    }
    }
    fetchTeamDetails(id);
    },[])
        
    return (
        <div>
            {loading?<Spinner animation="border" variant="primary" />:
            !team?<h2 className='text-white text-center'>Team not found</h2>:
            <>
            <Row>
                <Col >
                <Image src={team.team_logo} style={{height:'280px'}} />
                </Col>
                <Col>      
            <h1 className='text-white'>{team?.team_name}</h1>
            <p className='text-white'>{team?.team_description}</p>
            <p className='text-white'>Team trophies:{team?.team_trophies_won}</p>
            <p className='text-white'>Team manager:{team?.team_manager?.name}</p>
            <p className='text-white'>Team Captain:{team?.team_captain?.name}</p>
            </Col>
            </Row>
            <div>
                <h2 className='text-white text-center'>Players</h2>
                    <ListGroup>
                    {team?.team_players?.map(player=>(
                        <ListGroup.Item key={player._id}>{player.player_name}</ListGroup.Item>
                        ))}

        </ListGroup>
            </div>


            
                </>}
        </div>
    )
    }

    export default TeamDetails

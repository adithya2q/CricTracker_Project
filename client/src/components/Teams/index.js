import React, { useEffect } from 'react'
import { getTeams } from '../apiUtils/userApi';
import { Button, Card, Col, ListGroup, Nav, Row, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Teams = () => {
    const [teams,setTeams]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchTeams=async()=>{
            try{
                const result=await getTeams();
                console.log(result);
                if(result&&result.success){
                    setTeams(result.data);
                }
            }
            catch(error){
                console.error("error fetching teams",error)
            }
            finally{
                setLoading(false);
            }
        }
        fetchTeams();
    },[])
  return (
    <div>
        <Nav.Item className='d-flex align-items-end'>
         <Button variant='success'><Nav.Link as={NavLink} to='/team/register'  style={{color:'white'}}>Register Team</Nav.Link></Button>   
        </Nav.Item>
        {loading?<Spinner animation="border" variant="primary" />:
        teams.length===0?(<h2>No Teams</h2>):
        (<>
        <h1>Teams</h1>
        <Row>
        {teams.map(team=>(
            <Col lg={4} md={6}>
            <Nav.Link as={NavLink} to={`/team/${team._id}`}>
      <Card className='h-50 shadow-sm' style={{ width: '18rem' }} >
      <Card.Img variant="top" src={team.team_logo} style={{ height: '18rem' }} />
      <Card.Body>
        <Card.Title>{team.team_name}</Card.Title>
  
    <ListGroup variant="flush">
        <ListGroup.Item>{team.team_captain}</ListGroup.Item>
        <ListGroup.Item>{team.team_coach}</ListGroup.Item>
      </ListGroup>
      </Card.Body>
    </Card>
    </Nav.Link>
        </Col>
        ))}
        </Row>
        </>)}
      
    </div>
  )
}

export default Teams

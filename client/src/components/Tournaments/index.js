import React, { useEffect, useState } from 'react'
import { getTournaments } from '../apiUtils/userApi';
import { Button, Card, Col, ListGroup, Nav, Row, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Tournaments = () => {
    const [tournaments,setTournaments]=useState([]);
    const [activeTab,setActiveTab]=useState('live');
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchTournaments=async()=>{
            try {
                const response=await getTournaments();
                console.log(response);
                if (response && response.success){
                    setTournaments(response.data);
                }
            } catch (error) {
                console.log("error fetching tournaments",error)
            }
            finally{
                setLoading(false);
            }
        }
        fetchTournaments();
    },[]);

    const filteredTournaments=tournaments.filter((tournament)=>tournament.tournament_status.toLowerCase()===activeTab);
    console.log(filteredTournaments);

  return (
    <div>
         <Nav className="justify-content-center" activeKey={activeTab} onSelect={(e)=>setActiveTab(e)}>
                <Nav.Item>
                  <Nav.Link eventKey="live">Live</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="upcoming">Upcoming</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="completed">Completed</Nav.Link>
                </Nav.Item>
               <Nav.Item>
              <Button variant='success'><Nav.Link as={NavLink} to='/tournament/create' style={{color:'white'}}>Create Tournament</Nav.Link></Button>   
               </Nav.Item>
        </Nav>
        
        {loading?<Spinner animation="border" variant="primary" />:
        tournaments.length===0?(<h2>No Tournaments</h2>):(
        <>
        <h1 className='text-center m-3'>Tournaments</h1>
            {filteredTournaments.map((tournament)=>(
            <Nav.Link as={NavLink} to={`/tournament/${tournament._id}`} key={tournament._id}>
            <Row><Col lg={4} md={6}>
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" style={{ height: '18rem' }} src={tournament.tournament_image} />
        <Card.Body>
            <Card.Title>{tournament.tournament_name}</Card.Title>
    
        <ListGroup variant="flush">
            <ListGroup.Item>{tournament.tournament_status}</ListGroup.Item>
            <ListGroup.Item>{tournament.tournament_type}</ListGroup.Item>
            <ListGroup.Item>{tournament.tournament_start_date}-{tournament.tournament_end_date}</ListGroup.Item>
        </ListGroup>
        </Card.Body>
        </Card>
        </Col></Row>
        </Nav.Link>
            ))}
    </>)}
    </div>
  )
}

export default Tournaments

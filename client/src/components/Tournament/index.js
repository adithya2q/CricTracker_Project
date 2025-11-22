import React, { useEffect } from 'react'
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { getTournamentDetails } from '../apiUtils/userApi';
import { Button, Card, Col, ListGroup, Nav, Row, Spinner, Table } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const Tournament = () => {
    const {id}=useParams();
    const [tournament,setTournament]=useState({});
    const [loading,setLoading]=useState(true);
    const [activeTab,setActiveTab]=useState('matches');  
    const token=localStorage.getItem('token');

    useEffect(()=>{
        const fetchTournament=async()=>{
            try {
              const token=localStorage.getItem('token')
              const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
              const role=decodedToken.role;
               const response=await getTournamentDetails(id);
               console.log(response);
                if(response && response.success){
                    setTournament(response.data);
               } 
            } catch (error) {
                console.log("error fetching tournament",error)
            }
            finally{
                setLoading(false);
            }
        }
        fetchTournament();
    },[id])

  return (
    <div>
    <Nav className="justify-content-center" activeKey={activeTab} onSelect={(e)=>setActiveTab(e)}>
        <Nav.Item>
          <Nav.Link eventKey="matches">Matches</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="teams">Teams</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="points">Points table</Nav.Link>
        </Nav.Item>
                {token && jwtDecode(token).role==="admin" && (
        <Nav.Item>
         <Button className='btn btn-success'><Nav.Link as={NavLink} to='/tournament/:id/match/create'  style={{'color':'white'}}>Create Match</Nav.Link></Button>   
        </Nav.Item>
        )}
         </Nav>
    {loading?(<div className='text-center'>
        <Spinner animation="border" variant="primary" />
      </div>):(
        <>  


        {activeTab === 'matches'&&(
          <>
          {(tournament?.tournament_matches?.length===0)?
      (<div className='text-center'>No matches available </div>)
      :
      <>
      <h1>Matches</h1>
          {tournament?.tournament_matches?.map(item=>(
          <Nav.Link as={NavLink} to={`/match/${item._id}` }key={item._id}>  
         <Card>
           <Card.Header className='d-flex justify-content-between align-items-center'><span>{item.match_type}</span>
           <span>{item.match_category}</span>
           <span>{item.match_status}</span>
           {item.tossWinner && <span>{item.tossWinner?.team_name ||item.tossWinner} has won the toss and elected to {item.tossDecision}</span>}</Card.Header>
           <Card.Body>
             <Card.Title className='d-flex justify-content-between align-items-center'>
             <span><Card.Img variant="top" src={item.team1.team_logo} style={{width:"10rem", height:'10rem', objectFit:'cover'}}/>{item.team1.team_name}</span>
             <span>vs</span><span>
             <Card.Img variant="top" src={item.team2.team_logo} style={{width:"10rem", height:'10rem', objectFit:'cover'}} />{item.team2.team_name}</span> 
             </Card.Title>
         
             <Card.Footer className='d-flex justify-content-between align-items-center'>
               <span>{item.venue}</span>
               <span>{item.date}</span>
               <span>{item.result&&(item.result)}</span>
             </Card.Footer>
           </Card.Body>
         </Card>
          </Nav.Link>
        ))}
          </>
      }
      </>
        )}

        {activeTab==='teams'&&(
          <>
          <h1>Teams </h1>
          <Row>
      {tournament?.tournament_teams?.map((team)=>(
                <Col lg={4} md={6}>
        <Nav.Link as={NavLink} to={`/team/${team._id}`}>

      <Card className='h-50 shadow-sm' style={{ width: '18rem' }}>
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


        {activeTab==='points'&&(
          <div>
            <h1>Points table</h1>
             <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sl.No.</th>
          <th>Team</th>
          <th>Matches </th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Draws</th>
          <th>No result</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {tournament.points_table?.map((item,index)=>(
          <tr key={index}>
            <td>{index+1}</td>
            <td>{item.team_id?.team_name}</td>
            <td>{item.matches_played}</td>
            <td>{item.wins}</td>
            <td>{item.losses}</td>
            <td>{item.draws}</td>
            <td>{item.no_result}</td>
            <td>{item.points}</td>
            </tr>
          ))
          }
       
      </tbody>
      </Table>
          </div>
        )}
        </>
        
      
    

      )}
      
    </div>
  )
}

export default Tournament

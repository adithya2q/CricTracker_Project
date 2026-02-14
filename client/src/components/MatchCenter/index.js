import React, { useEffect, useState } from 'react'
import { Button, Card, Col,  Nav, Row, Spinner } from 'react-bootstrap';
import { getMatches } from '../apiUtils/userApi';
import { NavLink } from 'react-router-dom';

const MatchCenter= () => {
    const [matches,setMatches]=useState([]);
    const [activeTab,setActiveTab]=useState('live');
    const [loading,setLoading]=useState(true);


    useEffect(()=>{
        const fetchMatches=async()=>{
            try{
              const response=await getMatches();
              console.log(response);
                if(response && response.success){
                    setMatches(response.data);
                }
            }
            catch(error){
                console.log("error fetching matches",error)
            }
            finally{
                setLoading(false);
            }
        }
        fetchMatches();
    },[])


    const filteredMatches = matches.filter(
  (match) => match.match_status.toLowerCase() === activeTab
);

  return (
    <div>
      
          <Nav className="justify-content-center" activeKey={activeTab} onSelect={(e)=>setActiveTab(e)} >
        <Nav.Item>
          <Nav.Link eventKey="live" >Live</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="upcoming">Upcoming</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="completed">Completed</Nav.Link>
        </Nav.Item>
        <Nav.Item>
         <Button variant='success'><Nav.Link as={NavLink} to='/matches/match/create'  style={{color:'white'}}>Create Match</Nav.Link></Button>   
        </Nav.Item>
     </Nav>

      {loading?(<div className='text-center'>
        <Spinner animation="border" variant="primary" />
      </div>):filteredMatches.length===0?
      (<div className='text-center'>No matches available </div>):(
      
    
    filteredMatches.map(filteredMatches=>(
      <Nav.Link as={NavLink} to={`/match/${filteredMatches._id}` }key={filteredMatches._id}>  

      
<Card>
  <Card.Header className='d-flex justify-content-between align-items-center'><span>{filteredMatches.match_type}</span>
  <span>{filteredMatches.match_category}</span>
  <span>{filteredMatches.match_status}</span>
  <span>{filteredMatches.tournament&&filteredMatches.tournament.tournament_name}</span>
  {filteredMatches.tossWinner && <span>{filteredMatches.tossWinner?.team_name ||filteredMatches.tossWinner} has won the toss and elected to {filteredMatches.tossDecision}</span>}</Card.Header>
  <Card.Body>
    <Card.Title className='d-flex justify-content-between align-items-center'>
    <span><Card.Img variant="top" src={filteredMatches.team1.team_logo} style={{width:"10rem", height:'10rem', objectFit:'cover'}}/>{filteredMatches.team1.team_name}</span>
    <span>vs</span><span>
    <Card.Img variant="top" src={filteredMatches.team2.team_logo} style={{width:"10rem", height:'10rem', objectFit:'cover'}} />{filteredMatches.team2.team_name}</span> 
    </Card.Title>

    <Card.Footer className='d-flex justify-content-between align-items-center'>
      <span>{filteredMatches.venue}</span>
      <span>{filteredMatches.date}</span>
      <span>{filteredMatches.result&&filteredMatches.result}</span>
    </Card.Footer>
  </Card.Body>
</Card>
      </Nav.Link>
    ))

      )}
   
</div>
  );
}

export default MatchCenter;

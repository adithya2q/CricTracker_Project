import React, { useCallback, useEffect, useState } from 'react'
import { getChat, getMatchDetails, uploadChat } from '../apiUtils/userApi';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Accordion, Button, Form, ListGroup, Nav, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import MatchComplete from '../MatchComplete';
import io from 'socket.io-client';



const SOCKET_SERVER_URL = process.env.REACT_APP_API_URL;
const MatchDetails = () => {
const {id}=useParams();
const [activeTab,setActiveTab]=useState('scorecard');
const [match,setMatch]=useState({});
const [loading,setLoading]=useState(true);
const [chat,setChat]=useState({
  message:''
});
const [chatHistory, setChatHistory] = useState([]);
const [role,setRole]=useState('');

const fetchMatch=useCallback(async(id)=>{
    try{
    const response=await getMatchDetails(id);
    console.log(response);
    const response2=await getChat(id);
    console.log(response2);
    if(response && response.success){
        setMatch(response.data);
        }
    if(response2 && response2.success){
        setChatHistory(response2.data);

        }
    }
    catch(error){
        console.log("error fetching matches",error)
            }
    finally{
        setLoading(false);
            }
});
useEffect(()=>{
const token=localStorage.getItem('token')
const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
console.log(decodedToken);
setRole(decodedToken.role);
fetchMatch(id);
},[id])

useEffect(()=>{
  const socket=io(SOCKET_SERVER_URL);

  socket.emit('joinRoom',id); 

  socket.on('score_update',()=>{
    fetchMatch();
  })

  return ()=>{
    socket.disconnect();
    socket.off('score_update');
  }
},[id,fetchMatch]);

const handleChatChange=(e)=>{
  const {name,value}=e.target;
  setChat(prev=>({...prev,[name]:value}));
}

const handleChatSubmit=async(e)=>{
  e.preventDefault();
  const sentChat=await uploadChat(id,chat);
  if(sentChat && sentChat.success){
      toast("Chat sent successfully");
}
}

  return (
    <div>
    <Nav className="justify-content-center" activeKey={activeTab} onSelect={(e)=>setActiveTab(e)}>
        <Nav.Item>
          <Nav.Link eventKey="scorecard">Scorecard</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="commentary">Commentary</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="chat">Chat</Nav.Link>
        </Nav.Item>
         <Nav.Item>
            <Nav.Link eventKey="match_complete">Match Complete</Nav.Link>
          </Nav.Item>
        {role==="scorer" && (
          <>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`/matches/match/${id}/update`}>Update Match Settings</Nav.Link>
        </Nav.Item>
          </>
        )}
      </Nav>
      {loading?<Spinner animation="border" />:
      (activeTab==='scorecard')?
<div>      


      <Accordion defaultActiveKey='0'>
          {match?.innings?.map((item,index)=>(
      <Accordion.Item key={item._id || index} eventKey={index.toString()}>
        <Accordion.Header><p>{`Innings ${index + 1}`}: <strong>{item?.battingTeam?.team_id?.team_name} -{item?.Runs}/{item?.Wickets}   {item?.Overs}Overs</strong></p>
       
        </Accordion.Header>
        <Accordion.Body>

          <h2>Batting Scorecard</h2>
           <p ><span className='d-flex justify-content-between'>Run Rate:{item?.runRate} {item?.requiredRunRate>0&&<span>Required Run Rate-{item?.requiredRunRate}</span>}
         {item?.Boundaries>0 && <span>Boundaries:{item?.Boundaries}</span>}
         {item?.Sixes>0 && <span>Sixes:{item?.Sixes}</span>}
        </span> </p>
  <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sl.No.</th>
          <th>Batsman</th>
          <th>Runs</th>
          <th>Balls Faced</th>
          <th>4s</th>
          <th>6s</th>
          <th>SR</th>
        </tr>
      </thead>
      <tbody>
        {item?.battingScorecard?.map((item1,index)=>(
          <tr key={index}>
            <td>{index+1}</td>
            <td>{item1.player_id?.player_name}<br />{item1.Batting_status}</td>
            <td>{item1.Runs}</td>
            <td>{item1.Balls}</td>
            <td>{item1.Fours}</td>
            <td>{item1.Sixes}</td>
            <td>{item1.StrikeRate}</td>
            </tr>
          ))
          }
       
      </tbody>
      </Table>
      <h2>Bowling Scorecard</h2>
       <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sl.No.</th>
          <th>Bowler</th>
          <th>Overs</th>
          <th>Runs</th>
          <th>Wickets</th>
          <th>Maidens</th>
          <th>Economy rate</th>
        </tr>
      </thead>
      <tbody>
        {item?.bowlingScorecard?.map((item1,index)=>(
          <tr key={index}>
            <td>{index+1}</td>
            <td>{item1.player_id?.player_name}</td>
            <td>{item1.Overs}</td>
            <td>{item1.Runs}</td>
            <td>{item1.Wickets}</td>
            <td>{item1.Maidens}</td>
            <td>{item1.EconomyRate}</td>
            </tr>
          ))
          }
       
      </tbody>
      
    </Table>
        </Accordion.Body>
      </Accordion.Item>
         ))}
    </Accordion>

    </div>
      :
      activeTab === 'commentary' ? (
        <ListGroup>
          {match?.commentary?.map((item, index) => (
            <ListGroup.Item key={index}>Over-{item.over}    Runs-{item.runs}    {item.commentary}</ListGroup.Item>
          ))}
        </ListGroup>
      ) : activeTab === 'chat' ? (
        <>
          <Form onSubmit={handleChatSubmit} className='p-2'>
            <Form.Group>
              <Form.Control
                type="text"
                name='message'
                value={chat.message}
                onChange={handleChatChange}
              />
            </Form.Group>
            <Button type='submit'>enter chat</Button>
          </Form>
        <ListGroup>
          {chatHistory?.map((item, index) => (
            <ListGroup.Item key={index}>{item?.user?.name}: {item?.message}</ListGroup.Item>
          ))}
        </ListGroup>
        </>
      ) 
      :(activeTab==='match_complete') ? (<>
        <MatchComplete matchId={id} />
        </>)
      : null}
    </div>
  );
};

export default MatchDetails;

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getPlayerPerformance, getPlayers } from '../apiUtils/userApi';
import { useState } from 'react';
import { Button, Card, Form, ListGroup, Row, Table } from 'react-bootstrap';

const PlayerPerformance = () => {
    const {id}=useParams();
    const [players,setPlayers]=useState([]);
    const [playerPerformance,setPlayerPerformance]=useState({});
    const [innings,setInnings]=useState([]);
    const [player,setPlayer]=useState({});
    const [match_Type,setMatchType]=useState('');
    const [filters,setFilters]=useState({
      format:'',
      limit:5,
      player_id:''
    });

    const [open, setOpen] = useState({});

    useEffect(()=>{
        const fetchPlayers=async()=>{
          try{
          const response =await getPlayers()
          if(response && response.success){
            setPlayers(response.data);
          }
        }
      catch{
        console.error("error fetching players");
      }
    }
    fetchPlayers();
    },[])

    const handleEventChange=(e)=>{
        const {name,value}=e.target;
        setFilters((filters)=>({...filters,[name]:value}));
    }

    const handleFilterSubmit=async(e)=>{
        e.preventDefault();
        const apiparams={...filters};
        if(id){
            apiparams.player_id=id
        }
    const playerPerfo=await getPlayerPerformance(id,apiparams);
    if(playerPerfo && playerPerfo.success){
        setPlayerPerformance(playerPerfo.data.aggregate);
        setInnings(playerPerfo.data.inningsQuery);
        setPlayer(playerPerfo.data.player);
        setMatchType(playerPerfo.data.format);
        }
    }

  return (
    <div >
        <Row>
        <Form onSubmit={handleFilterSubmit}>
          {!id?<Form.Group>
          <Form.Label className='text-white'>Select Player</Form.Label>
          <Form.Select
          name='player_id'
          type='text'
          value={filters.player_id}
          onChange={handleEventChange}>
            <option value=''>Select Player</option>
            {players.map((player)=><option value={player._id} key={player._id}>{player.player_name}</option>)}
          </Form.Select>
          </Form.Group>:null}
          <Form.Group>
          <Form.Label className='text-white'>Select Format</Form.Label>
          <Form.Select
          name='format'
          type='text'
          value={filters.format}
          onChange={handleEventChange}>
            <option value=''>Select Format</option>
            <option value="T20I">T20I</option>
            <option value="ODI">ODI</option>
            <option value="TestI">Test</option>
            <option value="Domestic_T20">Domestic T20</option>
            <option value="Domestic_OD">Domestic OD</option>
            <option value="Domestic_Test">Domestic Test</option>

          </Form.Select>
          </Form.Group>

          <Form.Group>
          <Form.Label className='text-white'>Limit</Form.Label>
          <Form.Control
          name='limit'
          type='Number'
          value={filters.limit}
          onChange={handleEventChange}></Form.Control>
          </Form.Group>
            <Button type="submit" variant="primary" className='m-2'>
                Submit Filters
            </Button>
        </Form>
        </Row>
        <Row className='d-flex justify-content-center'>
        <Card className='p-3 mb-4 mt-4 w-50' >
        <Card.Title>{player.player_name}-{match_Type}</Card.Title>
        <Card.Img src={player.player_image} alt={player.player_name} />
        <ListGroup>
            <ListGroup.Item>{playerPerformance?.total_matches} Matches</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_innings} Innings</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_runs} Runs</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_balls} Balls Faced</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_fours} Fours</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_sixes} Sixes</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_notouts} NO</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.strikeRate} Strike Rate</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.battingAverage} Batting Avg.</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_wickets} Wickets</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_overs} Overs</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_runs_given} Runs conceded</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_maidens} Maidens</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.total_ballsbowled} Balls bowled</ListGroup.Item>
            <ListGroup.Item>{playerPerformance?.economyRate} ER</ListGroup.Item>
            </ListGroup>
        
        </Card>

        <Card className="p-3 shadow-sm">
        <h5 className='text-white'>Last {innings?.length} Innings</h5>
        <Table striped hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Venue</th>
              <th>Opponent</th>
              <th>Match Category</th>
              <th>Tournament</th>
              <th>Match_type</th>
            </tr>
          </thead>
          <tbody>

            {innings.map((inn,index) => (
              <>
              <tr key={index} onClick={() => setOpen(prev => ({ ...prev, [index]: !prev[index] }))} style={{ cursor: 'pointer' }}>
                <td>{inn.match_id?.date}</td>
                <td>{inn.match_id?.venue}</td>
                <td>{inn.opponent_id?.team_name}</td>
                <td>{inn.match_id?.match_category}</td>
                <td>{inn.match_id?.tournament?.tournament_name}</td>
                <td>{inn.match_id?.match_type}</td>
             </tr>
             {open[index]&&(<tr>
              <td colSpan={6}>
                <ListGroup>
                    <ListGroup.Item>Runs:{inn.batting.runs}</ListGroup.Item>
                    <ListGroup.Item>Balls Faced:{inn.batting.balls}</ListGroup.Item>
                    <ListGroup.Item>Fours:{inn.batting.fours}</ListGroup.Item>
                    <ListGroup.Item>Sixes:{inn.battting.sixes}</ListGroup.Item>
                    <ListGroup.Item>Batting Status:{inn.batting.batting_status}</ListGroup.Item>
                    <ListGroup.Item>Batting Strike Rate:{inn.batting.batting_status!=='not_batted'?
                   ( inn.batting.runs/inn.batting.balls)*100:0}</ListGroup.Item>
                    
                    <ListGroup.Item>Wicket taken:{inn.bowling.wickets}</ListGroup.Item>
                    <ListGroup.Item>Overs Bowled:{inn.bowling.overs}</ListGroup.Item>
                    <ListGroup.Item>Balls Bowled:{inn.bowling.balls_bowled}</ListGroup.Item>
                    <ListGroup.Item>Runs conceded:{inn.bowling.runs_conceded}</ListGroup.Item>
                    <ListGroup.Item>Maidens:{inn.bowling.maidens}</ListGroup.Item>
                    <ListGroup.Item>EconomyRate:{inn.bowling.balls_bowled>0?((inn.bowling.runs_conceded/inn.bowling.balls_bowled)*6):0}</ListGroup.Item>

                </ListGroup>
                </td>
                </tr>)}
                </>
            ))}
          </tbody>
        </Table>
      </Card>

        
        </Row>
      
    </div>
  )
}

export default PlayerPerformance

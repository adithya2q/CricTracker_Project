import React, { useState } from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getBatsmanVsBowler, getPlayers, getPlayerVsTeam, getPvsP, getTeams, getTeamVsTeam } from '../apiUtils/userApi';
import { Button, Card, Col, Form, Nav, Row, Spinner, Table } from 'react-bootstrap';

const HeadToHead = () => {
    const [playersList,setPlayersList]=useState([]);
    const [recievedData,setRecievedData]=useState({})
    const [teamsList,setTeamsList]=useState([]);
    const [players,setPlayers]=useState({
        player1:'', 
        player2:'',
        match_type:'',
        limit:0
    });
    const [playerVsTeam,setTeamVsPlayer]=useState({
        player:'',
        team:'',
        match_type:'',
        limit:0
    })
    const [teams,setTeams]=useState({
        team1:'',
        team2:'',
        match_type:'',
        limit:0        
    });
    const [loading,setLoading]=useState(true);
    const [activeTab, setActiveTab] = useState('PlayerVsPlayer');

    useEffect(()=>{
        const fetchPlayers=async()=>{
            try {
                const response=await getPlayers();
                const response2=await getTeams();
                if(response && response.success){
                    toast("Players fetched successfully");
                    setPlayersList(response.data);
                }
                if(response2 && response2.success){
                    toast("Teams fetched successfully");
                    setTeamsList(response2.data);
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

    const handlePlayerVsPlayerEventChange=(e)=>{
        const {name,value}=e.target;
        setPlayers((players)=>({...players,[name]:value}));
    }

    const handlePlayerVsTeamEventChange=(e)=>{
        const {name,value}=e.target;
        setTeamVsPlayer((playervsTeam)=>({...playervsTeam,[name]:value}));
    }

    const handleTeamVsTeamEventChange=(e)=>{
        const {name,value}=e.target;
        setTeams((teams)=>({...teams,[name]:value}));
    }

    const handlePlayerVsPlayer=async(e)=>{
        e.preventDefault()
        const res=await getPvsP(players);
        console.log("performance",res);
        if(res&&res.success){
            setRecievedData(res.data);
        }
        else{
            console.error("Error fetching details")
        }
    }

    const handleBatsmanVsBowler=async(e)=>{
        e.preventDefault()
        console.log("playerdetails",players)
        const res2=await getBatsmanVsBowler(players);
        console.log("performance",res2);
        if(res2&&res2.success){
            setRecievedData(res2.data);
        }
        else{
            console.error("Error fetching details")
        }
    }

    const handleTeamVsTeam=async(e)=>{
        e.preventDefault()
        console.log("playerdetails",players)
        const res3=await getTeamVsTeam(teams);
        if(res3&&res3.success){
            setRecievedData(res3.data);
        }
        else{
            console.error("Error fetching details")
        }
    }

    const handlePlayerVsTeam=async(e)=>{
        e.preventDefault()
        console.log("playerdetails",players)
        const res4=await getPlayerVsTeam(playerVsTeam);
        if(res4&&res4.success){
            setRecievedData(res4.data);
        }
        else{
            console.error("Error fetching details")
        }
    }

  return (
    <div>
        <Row className='g-4'>
            <Col md={2} lg={3}>
            <Nav
            className="flex-column bg-light p-3"
            activeKey={activeTab}
            onSelect={(e) => setActiveTab(e)}
            style={{ minHeight: "100vh" }} // full height left sidebar
            >           
            <Nav.Item>
              <Nav.Link eventKey="PlayerVsPlayer">Player vs Player</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="BatsmanVsBowler">Batsman vs Bowler</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="TeamVsTeam">Team vs Team</Nav.Link>
            </Nav.Item>
             <Nav.Item>
              <Nav.Link eventKey="PlayerVsTeam">Player vs Team</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            </Nav.Item>
        </Nav>
            </Col>
            {loading?<Spinner animation="border" variant="primary" />:
            (activeTab==="PlayerVsPlayer")?
            <Col>
                <h1>Player vs Player Stats</h1>
                <Form onSubmit={handlePlayerVsPlayer}>
                    <Form.Group>
                        <Form.Select
                        name='player1'
                        value={players.player1}
                        onChange={handlePlayerVsPlayerEventChange}>
                            <option value=''>Select Player 1</option>
                            {playersList.map(player=>(<option key={player._id} value={player._id}>{player.player_name}</option>))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Select
                        name='player2'
                        value={players.player2}
                        onChange={handlePlayerVsPlayerEventChange}>
                            <option value=''>Select Player 2</option>
                            {playersList.map(player=>(<option key={player._id} value={player._id}>{player.player_name}</option>))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Match Type</Form.Label>
                         <Form.Select aria-label="Default select example"
                        name="match_type" 
                        value={players.match_type} 
                        onChange={handlePlayerVsPlayerEventChange}>
                            <option value="">Select Match Type</option>
                            <option value="T20I">T20I</option>
                            <option value="ODI">ODI</option>
                            <option value="TestI">Test</option>
                            <option value="Domestic_T20">Domestic T20</option>
                            <option value="Domestic_OD">Domestic OD</option>
                            <option value="Domestic_Test">Domestic Test</option>
                        </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                        <Form.Label>Match Limit</Form.Label>
                         <Form.Control type="number" placeholder="Match Limit"  
                        name="limit" 
                        value={players.limit} 
                        onChange={handlePlayerVsPlayerEventChange}>
                        </Form.Control>
                        </Form.Group>
                    <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "find details"}
                    </Button>
                </Form>

               {recievedData?<Card className="text-center">
                    <Card.Header>
                        <h1>Player vs Player Stats</h1>  
                        <h2>{recievedData?.player1info?.player_name} vs {recievedData?.player2info?.player_name}</h2>
                        <h3>{recievedData?.match_type|| recievedData?.limit}</h3>
                        </Card.Header> 
                    <Card.Body>
                        <Table>
                            <tbody>
                            <tr>
                                <td><Card.Img src={recievedData?.player1info?.player_image} style={{height:'10rem'}}/></td>
                                <td></td>
                                <td><Card.Img src={recievedData?.player2info?.player_image} style={{height:'10rem'}} /></td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_matches}</td>
                                <td>Matches</td>
                                <td>{recievedData?.player2Performance?.total_matches}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_innings}</td>
                                <td>Innings</td>
                                <td>{recievedData?.player2Performance?.total_innings}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_runs}</td>
                                <td>Runs</td>
                                <td>{recievedData?.player2Performance?.total_runs}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_fours}</td>
                                <td>Fours</td>
                                <td>{recievedData?.player2Performance?.total_fours}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_sixes}</td>
                                <td>Sixes</td>
                                <td>{recievedData?.player2Performance?.total_sixes}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.battingAverage}</td>
                                <td>Batting Average</td>
                                <td>{recievedData?.player2Performance?.battingAverage}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.strikeRate}</td>
                                <td>Strike Rate</td>
                                <td>{recievedData?.player2Performance?.strikeRate}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_notouts}</td>
                                <td>NO</td>
                                <td>{recievedData?.player2Performance?.total_notouts}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_wickets}</td>
                                <td>Wickets</td>
                                <td>{recievedData?.player2Performance?.total_wickets}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_overs}</td>
                                <td>Overs</td>
                                <td>{recievedData?.player2Performance?.total_overs}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_runs_given}</td>
                                <td>Runs conceded</td>
                                <td>{recievedData?.player2Performance?.total_runs_given}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_maidens}</td>
                                <td>Maidens</td>
                                <td>{recievedData?.player2Performance?.total_maidens}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.total_ballsbowled}</td>
                                <td>Balls Bowled</td>
                                <td>{recievedData?.player2Performance?.total_ballsbowled}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.player1Performance?.economyRate}</td>
                                <td>Economy Rate</td>
                                <td>{recievedData?.player2Performance?.economyRate}</td>
                            </tr>
                            </tbody>
                        </Table>
                        
                    </Card.Body>
                </Card>:null}
            </Col>
            :(activeTab==="BatsmanVsBowler")?
            <Col>
                <h1>Batsman vs Bowler Stats</h1>
                <Form onSubmit={handleBatsmanVsBowler}>
                    <Form.Group>
                        <Form.Select
                        name='player1'
                        value={players?.player1}
                        onChange={handlePlayerVsPlayerEventChange}>
                            <option value=''>Select Batsman</option>
                            {playersList.map(player=>(<option key={player?._id} value={player?._id}>{player?.player_name}</option>))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Select
                        name='player2'
                        value={players?.player2}
                        onChange={handlePlayerVsPlayerEventChange}>
                            <option value=''>Select Bowler</option>
                            {playersList.map(player=>(<option key={player?._id} value={player?._id}>{player.player_name}</option>))}
                        </Form.Select>
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>Match Type</Form.Label>
                         <Form.Select aria-label="Default select example"
                        name="match_type" 
                        value={players.match_type} 
                        onChange={handlePlayerVsPlayerEventChange}>
                            <option value="">Select Match Type</option>
                            <option value="T20I">T20</option>
                            <option value="ODI">ODI</option>
                            <option value="TestI">Test</option>
                            <option value="Domestic_T20">Domestic T20</option>
                            <option value="Domestic_OD">Domestic OD</option>
                            <option value="Domestic_Test">Domestic Test</option>
                        </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                        <Form.Label>Match Limit</Form.Label>
                         <Form.Control type="number" placeholder="Match Limit"
                        name="limit" 
                        value={players.limit} 
                        onChange={handlePlayerVsPlayerEventChange}>
                        </Form.Control>
                        </Form.Group>

                    <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "FInd details"}
                    </Button>
                </Form>
                <Card className="text-center">
                    <Card.Header>
                        <h1>Batsman vs Bowler Stats</h1></Card.Header>   
                        <h2>{recievedData?.batsmaninfo?.player_name} vs {recievedData?.bowlerinfo?.player_name}</h2>
                        <h3>{recievedData?.match_type} ||{recievedData?.limit}</h3>
                    <Card.Body>
                        <Table>
                            <tbody >
                            <tr>
                                <td><Card.Img src={recievedData?.batsmaninfo?.player_image} style={{height:'10rem',width:'10rem'}}/></td>
                                <td><Card.Img src={recievedData?.bowlerinfo?.player_image} style={{height:'10rem',width:'10rem'}} /></td>
                            </tr>
                            <tr>
                                <td>Balls</td>
                                <td>{recievedData?.BatsmanVsBowler?.total_balls}</td>
                            </tr>
                           <tr>
                                <td>Runs</td>
                                <td>{recievedData?.BatsmanVsBowler?.total_runs}</td>
                            </tr>
                            <tr>
                                <td>Matches</td>
                                <td>{recievedData?.BatsmanVsBowler?.matches_played}</td>
                            </tr>
                            <tr>
                                <td>Dismissals</td>
                                <td>{recievedData?.BatsmanVsBowler?.total_dismissals}</td>
                            </tr>
                            <tr>
                                <td>Strike Rate</td>
                                <td>{recievedData?.BatsmanVsBowler?.strike_rate}</td>
                            </tr>
                            <tr>
                                <td>Economy Rate</td>
                                <td>{recievedData?.BatsmanVsBowler?.economy_rate}</td>
                            </tr>
                            </tbody>
                        </Table>
                        
                    </Card.Body>
                </Card>
            </Col>:
            (activeTab==="TeamVsTeam")?
            <Col>
                <h1>Team vs Team Stats</h1>
                <Form onSubmit={handleTeamVsTeam}>
                    <Form.Group>
                        <Form.Select
                        name='team1'
                        value={teams.team1}
                        onChange={handleTeamVsTeamEventChange}>
                            <option value=''>Select Team 1</option>
                            {teamsList.map(team=>(<option key={team._id} value={team._id}>{team.team_name}</option>))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Select
                        name='team2'
                        value={teams.team2}
                        onChange={handleTeamVsTeamEventChange}>
                            <option value=''>Select Team 2</option>
                            {teamsList.map(team=>(<option key={team._id} value={team._id}>{team.team_name}</option>))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Match Type</Form.Label>
                         <Form.Select aria-label="Default select example"
                        name="match_type" 
                        value={teams.match_type} 
                        onChange={handleTeamVsTeamEventChange}>
                            <option value=''>Select format</option>
                            <option value="T20I">T20</option>
                            <option value="ODI">ODI</option>
                            <option value="TestI">Test</option>
                            <option value="Domestic_T20">Domestic T20</option>
                            <option value="Domestic_OD">Domestic OD</option>
                            <option value="Domestic_Test">Domestic Test</option>
                        </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                        <Form.Label>Match Limit</Form.Label>
                         <Form.Control type="number" placeholder="Match Limit"
                        name="limit" 
                        value={teams.limit} 
                        onChange={handleTeamVsTeamEventChange}>
                        </Form.Control>
                        </Form.Group>                    
                    <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Find details"}
                    </Button>
                </Form>

                 <Card className="text-center">
                    <Card.Header>
                        <h1>Team vs Team Stats</h1></Card.Header>   
                        <h2>{recievedData?.team1?.team_name} vs {recievedData?.team2?.team_name}</h2>
                        <h3>{recievedData?.match_type}|| {recievedData?.limit}</h3>
                    <Card.Body>
                        <Table>
                            <tbody>
                            <tr>
                                <td><Card.Img src={recievedData?.team1?.logo} style={{height:'10rem',width:'10rem'}} /></td>
                                <td></td>
                                <td><Card.Img src={recievedData?.team2?.logo} style={{height:'10rem',width:'10rem'}}/></td>
                            </tr>
                            <tr>
                                <td>Matches</td>
                                <td>{recievedData?.teamVsTeamPerformance?.matches_played}</td>
                            </tr>
                            
                            <tr>
                                <td>{recievedData?.teamVsTeamPerformance?.team1?.team_name}Wins</td>
                                <td>{recievedData?.teamVsTeamPerformance?.team1_wins}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.teamVsTeamPerformance?.team2?.team_name}Wins</td>
                                <td>{recievedData?.teamVsTeamPerformance?.team2_wins}</td>
                            </tr>
                            <tr>
                                <td>Draws</td>
                                <td>{recievedData?.teamVsTeamPerformance?.draws}</td>
                            </tr>
                            <tr><td>Total stats</td></tr>
                             <tr>
                                <td>{recievedData?.team1?.team_name}</td>
                                <td>VS</td>
                                <td>{recievedData?.team2?.team_name}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.teamVsTeamPerformance?.team1_matches_played}</td>
                                <td>Total  Matches</td>
                                <td>{recievedData?.teamVsTeamPerformance?.team1_matches_played}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.teamVsTeamPerformance?.team1_total_wins}</td>
                                <td>Total  Wins</td>
                                <td>{recievedData?.teamVsTeamPerformance?.team2_total_wins}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.teamVsTeamPerformance?.team1_total_losses}</td>
                                <td>Total  Losses</td>
                                <td>{recievedData?.teamVsTeamPerformance?.team2_total_losses}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.teamVsTeamPerformance?.team1_total_draws}</td>
                                <td>Total  Draws</td>
                                <td>{recievedData?.teamVsTeamPerformance?.team2_total_draws}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.teamVsTeamPerformance?.team1_total_no_result}</td>
                                <td>Total No Results</td>
                                <td>{recievedData?.teamVsTeamPerformance?.team2_total_no_result}</td>
                            </tr>
                            <tr>
                                <td>{recievedData?.teamVsTeamPerformance?.team1_total_trophies}</td>
                                <td>Total Trophies</td>
                                <td>{recievedData?.teamVsTeamPerformance?.team2_total_trophies}</td>
                            </tr>
                            
                            </tbody>
                        </Table>
                        
                    </Card.Body>
                </Card>
            </Col>:
            (activeTab==="PlayerVsTeam")?
            <Col>
                <h1>Player vs Team Stats</h1>
                <Form onSubmit={handlePlayerVsTeam}>
                    <Form.Group>
                        <Form.Select
                        name='player'
                        value={playerVsTeam?.player}
                        onChange={handlePlayerVsTeamEventChange}>
                            <option value=''>Select Player</option>
                            {playersList.map(player=>(<option key={player._id} value={player?._id}>{player?.player_name}</option>))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Select
                        name='team'
                        value={playerVsTeam.team}
                        onChange={handlePlayerVsTeamEventChange}>
                            <option value=''>Select Team</option>
                            {teamsList.map(team=>(<option key={team._id} value={team._id}>{team.team_name}</option>))}
                        </Form.Select>
                    </Form.Group>

                        <Form.Group className="mb-3">
                        <Form.Label>Match Type</Form.Label>
                         <Form.Select aria-label="Default select example"
                        name="match_type" 
                        value={playerVsTeam.match_type} 
                        onChange={handlePlayerVsTeamEventChange}>
                            <option value="">Select format</option>
                            <option value="T20I">T20</option>
                            <option value="ODI">ODI</option>
                            <option value="TestI">Test</option>
                            <option value="Domestic_T20">Domestic T20</option>
                            <option value="Domestic_OD">Domestic OD</option>
                            <option value="Domestic_Test">Domestic Test</option>
                        </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                        <Form.Label>Match Limit</Form.Label>
                         <Form.Control type="number" placeholder="Match Limit"
                        name="limit" 
                        value={playerVsTeam.limit} 
                        onChange={handlePlayerVsTeamEventChange}>
                        </Form.Control>
                        </Form.Group> 
                    <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Find details"}
                    </Button>
                </Form>

                 <Card className='text-center'>
                    <Card.Header>
                        <h1>Player vs Team Stats</h1></Card.Header>   
                        <h2>{recievedData?.playerinfo?.player_name} vs {recievedData?.teaminfo?.team_name}</h2>
                        <h3>{recievedData?.match_type}|| {recievedData?.limit}</h3>
                    <Card.Body>
                        <Table>
                            <thead>
                            <tr>
                                <td><Card.Img src={recievedData?.playerinfo?.player_image} style={{height:'10rem',width:'10rem'}} /></td>
                                <td textAlign='center'>Vs</td>
                                <td><Card.Img src={recievedData?.teaminfo?.team_logo} style={{height:'10rem',width:'10rem'}} /></td>
                            </tr>
                            </thead>
                            <tbody textAlign='center'>
                             <tr>
                                <td>Matches</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_matches}</td>
                            </tr>
                            <tr>
                                <td>Innings</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_innings}</td>
                            </tr>
                            <tr>
                                <td>Runs</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_runs}</td>
                            </tr>
                            <tr>
                                <td>Fours</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_fours}</td>
                            </tr>
                            <tr>
                                <td>Sixes</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_sixes}</td>
                            </tr>
                            <tr>
                                <td>Batting Average</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.battingAverage}</td>
                            </tr>
                            <tr>
                                <td>Strike Rate</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.strikeRate}</td>
                            </tr>
                            <tr>
                                <td>NO</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_notouts}</td>
                            </tr>
                            <tr>
                                <td>Wickets</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_wickets}</td>
                            </tr>
                            <tr>
                                <td>Overs</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_overs}</td>
                            </tr>
                            <tr>
                                <td>Runs conceded</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_runs_given}</td>
                            </tr>
                            <tr>
                                <td>Maidens</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_maidens}</td>
                            </tr>
                            <tr>
                                <td>Balls Bowled</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.total_ballsbowled}</td>
                            </tr>
                            <tr>
                                <td>Economy Rate</td>
                                <td></td>
                                <td>{recievedData?.playerPerformance?.economyRate}</td>
                            </tr>
                            </tbody>
                        </Table>
                        
                    </Card.Body>
                </Card>
            </Col>
            
            :null
            
}
        </Row>
      
    </div>
  )
}

export default HeadToHead

    import React from 'react'
    import { useNavigate, useParams } from 'react-router-dom'
    import { toast } from 'react-toastify';
    import { completeScorecard, getMatchDetails, switchInnings, updateCommentary, updateMatchInfo, updateScore } from '../apiUtils/userApi';
    import { useState } from 'react';
    import { useEffect } from 'react';
    import { Nav, Form, Button, Spinner } from "react-bootstrap";
    import Select from 'react-select';
    import MatchDetails from '../MatchDetails';
    import MatchComplete from '../MatchComplete';


    const UpdateMatch = () => {
        const {id}=useParams();
        const [activeTab,setActiveTab]=useState('update_info');
        const [loading,setLoading]=useState(true);
        const [match,setMatch]=useState({});
        const [matchStatus,setMatchStatus]=useState('');
        const navigate=useNavigate();
        const [matchcomplete,setMatchcomplete]=useState(false);
        const [showwicketForm,setShowwicketForm]=useState(false);
        const [currentInnings,setCurrentInnings]=useState({});
        const [teamA,setTeamA]=useState({});
        const [teamB,setTeamB]=useState({});
        const [matchinfo,setMatchinfo]=useState({
            status:'live',
            tossWinner:'',
            tossDecision: ''
        });
        const [commentary,setCommentary]=useState({
          over:0,
          commentary:'',
          runs:0
        });

        const [balldata,setBalldata]=useState({
            striker:'',
            nonStriker:'',
            bowler:'',
            runs:0,
            extras:'',
            extrasType:'',
            wicket:false,
            wicketType:'',
            boundary:false,
            sixer:false,
            fielder:'',
            outplayer:'',
        });

        useEffect(()=>{
            const fetchDetails=async()=>{
                try {
                    const response1=await getMatchDetails(id);
                    if(response1 && response1.success){
                      const matchData=response1.data;
                        setMatch(response1.data);
                        const currentinnings=matchData.currentInnings||matchData.innings[matchData.innings.length-1];
                        setCurrentInnings(currentinnings);
                        setTeamA(currentinnings.battingTeam);
                        setTeamB(currentinnings.bowlingTeam);
                      
                    }
                } catch (error) {
                    console.error("error fetching match details",error)
                }
                finally{
                    setLoading(false);
                }
            }
            fetchDetails();
        },[]);


        const handleMatchInfoEventChange=(e)=>{
            const {name,value}=e.target;
            setMatchinfo((matchinfo)=>({...matchinfo,[name]:value}));
        }

        const handleScoreEventChange=(e)=>{
            const {name,value}=e.target;
            setBalldata((balldata)=>({...balldata,[name]:value}));
        }

        const handleBoundaryEventChange=(e)=>{
            if(e===4){
                setBalldata((balldata)=>({...balldata,boundary:!balldata.boundary}));
            }
            else if(e===6){
                setBalldata((balldata)=>({...balldata,sixer:!balldata.sixer}));
            }
        }

        const resetScorecard = () => {
      setBalldata({
        striker: '',
        nonStriker: '',
        bowler: '',
        runs: 0,
        extras: '',
        extrasType: '',
        wicket: false,
        wicketType: '',
        boundary: false,
        sixer: false,
        fielder: '',
        outplayer: '',
      });

      setShowwicketForm(false); 
    };


        const handleInfoSubmit=async(e)=>{
            e.preventDefault();
            const sentMatchInfo=await updateMatchInfo(id,matchinfo);
            if(sentMatchInfo && sentMatchInfo.success){
                toast("Match info updated successfully");
                    console.log("updateMatchInfo",sentMatchInfo.data);
                setMatch(sentMatchInfo.data);
                setMatchStatus(sentMatchInfo.data.match_status);
                navigate('/matches');
            }
            
        }

        const handleCommentaryChange=(e)=>{
            const {name,value}=e.target;
            setCommentary(prev=>({...prev,[name]:value}));
        }

        const handleCommentarySubmit=async(e)=>{
            e.preventDefault();
            const sentCommentary=await updateCommentary(id,commentary);
            if(sentCommentary && sentCommentary.success){
                toast("Commentary updated successfully");
            }
        }

        const handleWicket=(e)=>{
          setShowwicketForm(!showwicketForm);
          setBalldata((balldata)=>({...balldata,wicket:!balldata.wicket}));
        }

        const handleScoreUpdateSubmit=async(e)=>{
            e.preventDefault();
            console.log("Score data ",balldata);
            const Sentscore=await updateScore(id,balldata);
            if(Sentscore && Sentscore.success){
                setBalldata(prev => ({
                  ...prev,
                  striker: Sentscore.strikerbat,
                  nonStriker: Sentscore.current_nonstriker,
                  bowler: Sentscore.current_bowler,
                  runs: 0,
                  extras: '',
                  extrasType: '',
                  wicket: false,
                  wicketType: '',
                  boundary: false,
                  sixer: false,
                  fielder: '',
                  run_out_player: ''
                }));
                toast("Score updated successfully");
            }
        }


        const handleSwitchInnings=async()=>{
          try{
            const res=await switchInnings(id);
            console.log(res);
            if(res && res.success){
              toast.success(res.message);
              setMatch(res?.data);
              setCurrentInnings(res?.data.currentInnings);
              setTeamA(res?.data.currentInnings.batting_team);
              setTeamB(res?.data.currentInnings.bowling_team);
              resetScorecard();
            }
          }
          catch(error){
            console.log("Switch innings error:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Error switching innings");
          }
        }

        const handleScorecardComplete=async(req,res)=>{
          try{
            const res=await completeScorecard(id);
            console.log(res);
            if(res && res.success){
              toast.success(res.message,"Match Score completed successfully");
              navigate('/matches');
            }
          }
          catch(error){
            console.log("Error completing matchscore", error.response?.data || error);
            toast.error(error.response?.data?.message || "Error completeing match score");
          }
        }
      

      return (
        <div>
        <Nav className="justify-content-center" activeKey={activeTab} onSelect={(e)=>setActiveTab(e)}>
            <Nav.Item>
              <Nav.Link eventKey="update_info">Update Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="update_scorecard">Update Scorecard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="update_commentary">Update Commentary</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="match_complete">Match Complete</Nav.Link>
            </Nav.Item>
        </Nav>
        {loading?(<div className='d-flex text-center align-items-center justify-content-center'>
            <Spinner animation="border" variant="primary" /></div>):(
                <>
        {activeTab==='update_info' && (
            <>
            <h1>Update Info</h1>
            <Form onSubmit={handleInfoSubmit}>
            <Form.Group>
              <Form.Label>Toss winner</Form.Label>
              <Form.Select
              name='tossWinner'
              value={matchinfo.tossWinner}
              onChange={handleMatchInfoEventChange}>
                <option value=''>Select winner</option>
                <option value={match?.team1?._id}>{match?.team1?.team_name}</option>
                <option value={match?.team2?._id}>{match?.team2?.team_name}</option>
              </Form.Select>
              </Form.Group>

              <Form.Group>
              <Form.Label>Toss decision</Form.Label>
              <Form.Select
              name='tossDecision'
              value={matchinfo.tossDecision}
              onChange={handleMatchInfoEventChange}>
                <option value=''>Select decision</option>
                <option value='bat'>Bat</option>
                <option value='bowl'>Bowl</option>
              </Form.Select>
              </Form.Group>



                {matchinfo.status === 'completed' && (
                  <MatchComplete matchId={id} />
                )}
              <div className="text-center">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Update Details"}
              </Button>
              </div>


            </Form>
            </>)}


        {activeTab==='update_scorecard' &&matchStatus!=='upcoming' && matchcomplete===false && (
            <>
            <h1>Update Scorecard</h1>
            <h2>{teamA?.team_id?.team_name} batting & {teamB?.team_id?.team_name} bowling</h2>
                    <Form onSubmit={handleScoreUpdateSubmit}>

            
              <Form.Group>
              <Form.Label>Striker</Form.Label>
              <Form.Select
              name='striker'
              onChange={handleScoreEventChange}
              value={balldata.striker}>
                <option value=''>Select Striker</option>
                {teamA?.players?.map((player) => (
                  <option key={player?._id} value={player?._id}>
                    {player?.player_name}
                  </option>
                ))}
                
              </Form.Select>
              </Form.Group>


              <Form.Group>
              <Form.Label>Non striker</Form.Label>
              <Form.Select
              name='nonStriker'
              onChange={handleScoreEventChange}
              value={balldata.nonStriker}>
                <option value=''>Select Non Striker</option>
                {teamA?.players?.map((player) => (
                  <option key={player?._id} value={player?._id}>
                    {player?.player_name}
                  </option>
                ))}
                
              </Form.Select>
              </Form.Group>

              <Form.Group>
              <Form.Label>Bowler</Form.Label>
              <Form.Select
              name='bowler'
              onChange={handleScoreEventChange}
              value={balldata.bowler}>
                <option value=''>Select bowler</option>
                {teamB?.players?.map((player) => (
                  <option key={player?._id} value={player?._id}>
                    {player?.player_name}
                  </option>
                ))}
                
              </Form.Select>
              </Form.Group>

                <span className='d-flex gap-2'>
              <Form.Group>
              <Form.Label>Select Runs</Form.Label>
              <Form.Control
              type='number'
              name='runs'
              value={balldata.runs}
              onChange={handleScoreEventChange}
              placeholder='Enter Runs'>
              </Form.Control>
              </Form.Group>
              <Button variant={(balldata.boundary)? "danger" : "success"} className='m-2 ps-5 pe-5' onClick={()=>handleBoundaryEventChange(4)}>4</Button>
              <Button variant={(balldata.sixer)? "danger" : "success"} className='m-2 ps-5 pe-5' onClick={()=>handleBoundaryEventChange(6)}>6</Button>
                </span>
            <Form.Group>
              <Form.Label>Extras</Form.Label>
              <Form.Control
              type='number'
              name='extras'
              onChange={handleScoreEventChange}
              >
              </Form.Control>
              </Form.Group>

              {balldata.extras && (
                <Form.Group>
                <Form.Label>Extra Type</Form.Label>
                <Form.Select
                name='extrasType'
                value={balldata.extrasType}
                onChange={handleScoreEventChange}>
                  <option value=''>Select Extra Type</option>
                  <option value='byes'>Byes</option>
                  <option value='legbyes'>Leg Byes</option>
                  <option value='wides'>Wides</option>
                  <option value='noballs'>No Balls</option>
                </Form.Select>
                </Form.Group>
              )}
            
            

              <Button onClick={handleWicket}
              variant={(showwicketForm )? "danger" : "primary"}>Wicket</Button>

                {showwicketForm &&
                      <Form.Group>
              <Form.Label>Wicket Type</Form.Label>
              <Form.Select
              name='wicketType'
              value={balldata.wicketType}
              onChange={handleScoreEventChange}
              disabled={!balldata.wicket}>
                <option value=''>Select Wicket Type</option>
                <option value='bowled'>Bowled</option>
                <option value='LBW'>LBW</option>
                <option value='caught'>Caught</option>
                <option value='caught and bowled'>Caught and Bowled</option>
                <option value='run_out'>Run Out</option>
                <option value='retired hurt'>Retired Hurt</option>
                <option value='stumped'>Stumped</option>
              </Form.Select>
              </Form.Group>
              } 

                {balldata.wicketType&&['caught','run_out','stumped'].includes(balldata.wicketType) && (
                        <Form.Group>
              <Form.Label>Select fielder</Form.Label>
              <Form.Select
                name='fielder'
              value={balldata.fielder}
              onChange={handleScoreEventChange}
              >
                <option value=''>Select fielder</option>
                {teamB?.players?.map((player) => (
                  <option key={player?._id} value={player?._id}>
                    {player?.player_name}
                  </option>
                ))}
              </Form.Select>
              </Form.Group>
              )}

              {balldata.wicketType==='run_out' && (
              <Form.Group>
              <Form.Label>Select Player out</Form.Label>
              <Form.Select
                name='run_out_player'
              value={balldata.run_out_player}
              onChange={handleScoreEventChange}
              >
                <option value=''>Select dismissed player</option>
                <option value={balldata.striker}>Striker</option>
                <option value={balldata.nonStriker}>Non Striker</option>
              </Form.Select>
              </Form.Group>
              )}







            <div className="text-center mt-3">
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Update Scorecard"
                )}
              </Button>
            </div>
            <div className="text-center mt-3">
          <Button variant="warning" onClick={handleSwitchInnings}>
          Switch Innings
          </Button>

          <Button className='me-5 ms-5' variant='info' onClick={resetScorecard}>
          Reset Score entry
          </Button>

          <Button className='me-5 ms-5' variant='info' onClick={handleScorecardComplete}>
          Match Scorecard Complete
          </Button>
            </div>

              </Form>
            <MatchDetails />
            
            
            </>)}

        {activeTab==='update_commentary' && (<>
        <h1>Update Commentary</h1>
        <Form onSubmit={handleCommentarySubmit}>
          <Form.Group>
              <Form.Label>Overs</Form.Label>
                <Form.Control
                name='over'
                type='number'
                value={commentary.over}
                onChange={handleCommentaryChange}
                placeholder='Enter over'></Form.Control>
              </Form.Group>

                    <Form.Group>
              <Form.Label>Commentary</Form.Label>
                <Form.Control
                name='commentary'
                type='text'
                value={commentary.commentary}
                onChange={handleCommentaryChange}
                placeholder='Enter commentary'></Form.Control>
              </Form.Group>

              <Form.Group>
              <Form.Label>Runs</Form.Label>
                <Form.Control
                name='runs'
                type='number'
                value={commentary.runs}
                onChange={handleCommentaryChange}
                placeholder='Enter runs'></Form.Control>
              </Form.Group>
            <div className="text-center">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Send commentary"}
              </Button>
              </div>
              </Form>

              
        </>)}

        {activeTab==='match_complete' && (<>
        <MatchComplete matchId={id} /></>)}
        </>)}


          
        </div>
      )
    }

    export default UpdateMatch

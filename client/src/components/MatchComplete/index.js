import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getMatchDetails, matchcompleted } from '../apiUtils/userApi';
import { toast } from 'react-toastify';

const MatchComplete = ({matchId}) => {
    const [match,setMatch]=useState({}); 
    const [loading,setLoading]=useState(true);
    const [matchResult,setMatchResult]=useState({
        matchOutcome:'',
        matchWinner: '',
        result: '',
        tournamentId: '',
        points: 0
    });

    const handlematchResultEventChange=(e)=>{
        const {name,value}=e.target;
        setMatchResult((matchResult)=>({...matchResult,[name]:value}));
    }

    useEffect(()=>{
        const fetchMatch=async()=>{
        try {
                const response= await getMatchDetails(matchId);
                console.log("match details",response);
                if(response && response.success){
                    setMatch(response.data);
                }
            }
            catch (error) {
                console.error("error fetching match details",error)
            }
            finally{
                setLoading(false);
            }
        }
        fetchMatch();
    },[])

     const handleMatchCompleted=async()=>{
      try{
        const sentMatchCompleted=await matchcompleted(matchId,matchResult);
        if(sentMatchCompleted && sentMatchCompleted.success){
          toast.success(sentMatchCompleted.message);  
        }
      }
      catch(error){
        console.error("error completing match",error)
      }
    }


    return (
    <div>
         {match?.match_status === 'completed' && (
                <Form>

                   <Form.Group>
          <Form.Label>Match Outcome</Form.Label>
          <Form.Select
          name='matchOutcome'
          value={matchResult.matchOutcome}
          onChange={handlematchResultEventChange}>
            <option value=''>Select Outcome</option>
            <option value='winnerPresent'>Winner Present</option>
            <option value='draw'>Draw</option>
            <option value='noResult'>No Result</option>
          </Form.Select>
          </Form.Group>


          <Form.Group>
          <Form.Label>Match winner</Form.Label>
          <Form.Select
          name='matchWinner'
          value={matchResult.matchWinner}
          onChange={handlematchResultEventChange}>
            <option value=''>Select winner</option>
            <option value={match.team1._id}>{match.team1.team_name}</option>
            <option value={match.team2._id}>{match.team2.team_name}</option>
          </Form.Select>
          </Form.Group>

          <Form.Group>
          <Form.Label>Result</Form.Label>
            <Form.Control
            name='result'
            value={matchResult.result}
            onChange={handlematchResultEventChange}
            placeholder='Enter result'></Form.Control>
          </Form.Group>

          <Form.Group>
          <Form.Label>Tournament</Form.Label>
          <Form.Select
          name='tournamentId'
          value={matchResult.tournamentId}
          onChange={handlematchResultEventChange}>
            <option value=''>Select Tournament(if any)</option>
            {match?.tournament && (
              <option value={match.tournament._id}>
                {match.tournament.tournament_name}
              </option>
            )}
          </Form.Select>
          </Form.Group>

          <Form.Group>
          <Form.Label>Points</Form.Label>
            <Form.Control
            name='points'
            value={matchResult.points}
            onChange={handlematchResultEventChange}
            placeholder='Enter result'></Form.Control>
          </Form.Group>
            
           <div className="text-center mt-3">
      <Button variant="warning" onClick={handleMatchCompleted}>
      Match Completed
      </Button>
        </div> 
          </Form>
        )}
      
    </div>
  )
}

export default MatchComplete

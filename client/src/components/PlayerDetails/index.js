import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Col, ListGroup, Row, Spinner, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getPlayerDetails } from '../apiUtils/userApi';
import PlayerPerformance from '../PlayerPerformance';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 

const PlayerDetails = () => {
const {id}=useParams();
const [player,setPlayer]=useState({});
const [loading,setLoading]=useState(true);
const navigate=useNavigate();
const token=localStorage.getItem('token')
const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
let role;
if (decodedToken) {
    role=decodedToken.role;
  } else {
    role=''
  }

useEffect(()=>{

    const fetchPlayerDetails=async()=>{
        try {
            const response=await getPlayerDetails(id);
            console.log(response.data);
            if(response && response.success){
                setPlayer(response.data);
            }
        } catch (error) {
            console.error("error fetching player",error)
        }
        finally{
            setLoading(false);
        }
    }
    fetchPlayerDetails(id);
},[id])

  return (
    <div>
      {loading?<Spinner animation="border" variant="primary" />:
            <>
        <h1 className='text-white'>Player Details</h1>
        <Row>
            <Col md={4} lg={4}>
                <img src={player.player_image} alt="" className='w-100' style={{objectFit:'cover', height:'300px'}} />
                <ListGroup>
                <ListGroup.Item>Name: {player.player_name}</ListGroup.Item>
                <ListGroup.Item>Role: {player.player_role}</ListGroup.Item>
                <ListGroup.Item>DOB: {player.player_dob}</ListGroup.Item>
                <ListGroup.Item>Age: {player.player_age}</ListGroup.Item>
                <ListGroup.Item>Nationality:{player.player_nationality}</ListGroup.Item>
                <ListGroup.Item>Batting Style:{player.player_batting_style}</ListGroup.Item>
                <ListGroup.Item>Bowling Style:{player.player_bowling_style}</ListGroup.Item>
                {player.player_teams && player.player_teams.length > 0 ? (
                <ListGroup.Item>
                  Team(s): {player.player_teams.map(team => team.team_name).join(', ')}
                </ListGroup.Item>
              ) : (
                <ListGroup.Item>Team: {player.special_team_status || 'N/A'}</ListGroup.Item>
              )}
              </ListGroup>
            </Col>
         {player.player_statistics?(
            <Col md={8} lg={8}>
            <h2 className='text-white'>Batting Statistics</h2>
             <Table className='players-table'>
                <thead>
        <tr>
          <th>Format</th>
          <th>M</th>
          <th>Inns</th>
          <th>Runs</th>
          <th>HS</th>
          <th>Avg</th>
          <th>NO</th>
          <th>50s</th>
          <th>100s</th>
          <th>{'>'} 200s</th>
          <th>4s</th>
          <th>6s</th>
          <th>SR</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(player.player_statistics).map(([format,stats])=>(
        <tr key={format}>
            <td>{format}</td>
            <td>{stats.matches_played}</td>
            <td>{stats.Innings_played}</td>
            <td>{stats.runs}</td>
            <td>{stats.highest_score}</td>
            <td>{stats.batting_average}</td>
            <td>{stats.not_outs}</td>
            <td>{stats.fifties}</td>
            <td>{stats.centuries}</td>
            <td>{stats.double_centuries}</td>
            <td>{stats.fours}</td>
            <td>{stats.sixes}</td>
            <td>{stats.strike_rate}</td>
        </tr>
        ))}
      </tbody>
            </Table>
            <h2 className='text-white'>Bowling & Fielding Statistics</h2>
         <Table className='players-table'>
                <thead>
        <tr>
          <th>Format</th>
          <th>M</th>
          <th>Runs</th>
          <th>Avg</th>
          <th>ER</th>
          <th>Wkts</th>
          <th>BBF</th>
          <th>5w</th>
          <th>10w</th>
          <th>Cts</th>
          <th>Run outs</th>
          <th>Stmpgs</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(player.player_statistics).map(([format,stats])=>(
        <tr key={format}>
            <td>{format}</td>
            <td>{stats.matches_played}</td>
            <td>{stats.runs_given}</td>
            <td>{stats.bowling_average}</td>
            <td>{stats.economy_rate}</td>
            <td>{stats.wickets}</td>
            <td>{stats.best_bowling_figures
              ? `${stats.best_bowling_figures.wickets}/${stats.best_bowling_figures.runs}`
              : 'N/A'}</td>
            <td>{stats.five_wickets}</td>
            <td>{stats.ten_wickets}</td>
            <td>{stats.catches}</td>
            <td>{stats.run_outs}</td>
            <td>{stats.stumpings}</td>
        </tr>
        ))}
      </tbody>
            </Table>
        </Col>
):  <p>No statistics available</p>}
        </Row>
        
        {(role==="teamManager")? <PlayerPerformance id={id}/>:null}
        </>}
    </div>
  )
}

export default PlayerDetails

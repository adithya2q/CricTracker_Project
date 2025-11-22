import React, { use, useEffect, useState } from 'react'
import { Button, Nav, Spinner, Table } from 'react-bootstrap';
import { getPlayers } from '../apiUtils/userApi';
import { NavLink, useNavigate } from 'react-router-dom';

const Players = () => {
    const [players,setPlayers]=useState([]);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();
    

    useEffect(()=>{
        const fetchPlayers=async()=>{
            try {
                const response=await getPlayers();
                if(response && response.success){
                    setPlayers(response.data);
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

  return (
    <div>
      <Nav.Item className='d-flex align-items-end'>
         <Button variant='success'><Nav.Link as={NavLink} to='/player/register'  style={{color:'white'}}>Register Player</Nav.Link></Button>   
        </Nav.Item>
        {loading?<Spinner animation="border" variant="primary" />:
        players.length===0?(<h2>No Players</h2>):
        (<>
        
        <h1>Players</h1>
          <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sl.No.</th>
          <th>Player Name</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player,index)=>(
            <tr key={index} onClick={()=>navigate(`/player/${player._id}`)}>
                <td>{index+1}</td>
                <td>{player.player_name}</td>
                <td>{player.player_nationality}</td>
            </tr>
        ))}
        </tbody>
        </Table>
        </>)
        }
      
    </div>
  )
}

export default Players

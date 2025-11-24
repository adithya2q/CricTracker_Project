import React, { use, useEffect, useState } from 'react'
import { Button, Form, Nav, Spinner, Table } from 'react-bootstrap';
import { getPlayers } from '../apiUtils/userApi';
import { NavLink, useNavigate } from 'react-router-dom';


const Players = () => {
    const [players,setPlayers]=useState([]);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();
    const [searchQuery,setSearchQuery]=useState('');

    

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
   

    const filteredPlayers=players.filter(player=>player.player_name.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div>
      <Nav.Item className='d-flex align-items-end mb-3'>
         <Button variant='success' className='m-3'><Nav.Link as={NavLink} to='/player/register'  style={{color:'white'}}>Register Player</Nav.Link></Button>   
        </Nav.Item>
        {loading?<Spinner animation="border" variant="primary" />:
        players.length===0?(<h2>No Players</h2>):
        (<>
        <Form >
          <Form.Group className="mb-3">
            <Form.Control
            name='searchQuery'
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)} />
          </Form.Group>

        </Form>
        <h1 className='text-white text-center'>Players</h1>
          <Table striped bordered hover className='players-table'>
      <thead>
        <tr>
          <th>Sl.No.</th>
          <th>Player Name</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {filteredPlayers.map((player,index)=>(
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

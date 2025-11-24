import React from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { use } from 'react';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';


const Layout = () => {
  const token = localStorage.getItem("token"); 
  const navigate=useNavigate();
  const [role,setRole]=useState('');
  const user=localStorage.getItem('loggedInId');

  useEffect(()=>{
   if(token){
 
  const decodedToken=token?jwtDecode(localStorage.getItem('token')):null;
  setRole(decodedToken.role); 
   } 
  },[])
  const handleSignOut=()=>{
    localStorage.removeItem('@token');
    localStorage.removeItem('loggedInId');
    if(localStorage.getItem('team_id')){
      localStorage.removeItem('team_id');
    }
    navigate("/login")
}
   return (
    <div >

      <Navbar bg='success' expand="lg" >
      <h1>CricTrackerPro</h1>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to='/'>Home</Nav.Link>
            <Nav.Link as={NavLink} to='/matches'>Match Center</Nav.Link>
            <Nav.Link as={NavLink} to='/tournaments'>Tournaments</Nav.Link>
            <Nav.Link as={NavLink} to='/teams' >Teams</Nav.Link>
            <Nav.Link as={NavLink} to='/players' >Players</Nav.Link>
            {role==='teamManager'&&
            <Nav.Link as={NavLink} to='/reportsAndManagement'>Reports and Management</Nav.Link>}

                    
          </Nav>   
           </Navbar.Collapse>  
        <Navbar.Collapse className="justify-content-end">
                {token && (
          <Navbar.Text className='me-3'>
        <Button onClick={handleSignOut} variant="danger" className='ms-3'>
          Sign Out
        </Button>
      </Navbar.Text>  
      )}

      {role==='admin' && (
          <Navbar.Text className='me-3'>
        <Button onClick={()=>{navigate('/user/register',{state:{role:'admin'}})}} variant="warning" className='ms-3'>
          Register User
        </Button>
      </Navbar.Text>  
      )}

        </Navbar.Collapse>
        
      </Container >
    </Navbar >
    <Container style={{background:"url('https://png.pngtree.com/background/20250103/original/pngtree-a-large-cricket-stadium-green-field-empty-picture-image_15985507.jpg')", backgroundRepeat:'no-repeat',backgroundPosition:'fixed',backgroundAttachment:'fixed',minHeight:'100vh',top:0,left:0,backgroundSize:'cover', width:'100%'}}   >
    <Outlet ></Outlet>
    </Container>
    </div>
  )
}

export default Layout

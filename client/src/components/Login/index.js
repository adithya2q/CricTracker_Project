import React, { useEffect, useState } from 'react'
import { userLogin } from '../apiUtils/userApi';
import {useNavigate } from 'react-router-dom'
import { Col, Container, Row,  Form } from 'react-bootstrap'
import { toast } from 'react-toastify';


const LoginPage = () => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [role,setRole]=useState('viewer');//default role is user

    const navigate=useNavigate();


    useEffect(()=>{
        const token=localStorage.getItem('token');
        const loggedIn=localStorage.getItem('loggedInId');
        if(token&&loggedIn){
            navigate('/')
        }
        else{
            localStorage.removeItem('token');
            localStorage.removeItem('loggedInId');
        }
    },[])

    const isValid=()=>{
        if(email && password && role && email.trim().length>0 && password.trim().length>0){
            const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        }
        else{
            return false;
        }
    }

    const handleSubmit=async(event)=>{
        event.preventDefault();
        email.trim();
        password.trim();
        if(isValid()){
            const response=await userLogin({email,password,role});
            if(response&&response.success){
                localStorage.setItem('token',response.token);
                 localStorage.setItem('loggedInId',response.data._id);
                 if(response.data.team_id){
                   localStorage.setItem('team_id',response.data.team_id);
                 }
                navigate('/');
            }
            else{
                toast("Credentials could not be verified");
            }
        }
        else{
            toast("Please enter valid details");
        }
    }

    const handleRegister=()=>{
        navigate('/user/register');
    }



   return (
    <div>
    <Container>
      <Row className='g-0 text-white' style={{backgroundImage:"url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JpY2tldCUyMHNwb3J0fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000')",backgroundRepeat:'no-repeat',backgroundPosition:'center',minHeight:'100vh',backgroundSize:'cover'}}>
        <Col xs={12}  md={6}  className='d-flex align-items-center justify-content-center' >
      <div style={{backgroundColor:'darkred', padding:'20px', borderRadius:'10px', width:'100%', maxWidth:'400px', boxShadow:'0 0 10px rgba(0,0,0,0.1)'}}>
    <Form  onSubmit={handleSubmit} style={{marginTop:'4rem'}}>
        <h1 className='text-center mb-4'>Login</h1>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" 
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)} />
      
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password"
         placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}  />
      </Form.Group>

<Form.Group className="mb-3" controlId="formGroupRole">
<Form.Check
  inline
  label="Admin"
  name="role"
  type="radio"
  id="radio-admin"
  value="admin"
  onChange={() => setRole('admin')}
/>
<Form.Check
  inline
  label="viewer"
  name="role"
  type="radio"
  id="radio-viewer"
  value="viewer"
  onChange={() => setRole('viewer')}
/>
<Form.Check
  inline
  label="teamManager"
  name="role"
  type="radio"
  id="radio-teammanager"
  value="teamManaer"
  onChange={() => setRole('teamManager')}
/>
<Form.Check
  inline
  label="scorer"
  name="role"
  type="radio"
  id="radio-scorer"
  value="scorer"
  onChange={() => setRole('scorer')}
/>
</Form.Group>
      <button type="submit" className='btn btn-success'  >Login</button>
    </Form>
          <button className='btn btn-warning mt-2 text-white' onClick={handleRegister} >Register</button>
    </div>
        </Col>
      </Row>
    </Container>
    </div>

  )
}

export default LoginPage

import React, { useState } from 'react'
import { userRegister } from '../apiUtils/userApi';
import { toast } from 'react-toastify';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Register = () => {
    const location=useLocation();
    const admin=location.state;
    const pageTitle=admin?'Admin Register':'User Register';
    const isAdmin=admin && admin.role==='admin';

    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [phone,setPhone]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [role,setRole]=useState('viewer');

    useEffect(()=>{
      if(!isAdmin){
        setRole('viewer');
      }
    },[isAdmin])

        const isValid=()=>{
        if (name && name.trim().length>0 && email && email.trim().length>0&& phone && phone.trim().length>0 && password && password.trim().length>0&& confirmPassword && confirmPassword.trim().length>0 && password===confirmPassword) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{10}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return emailPattern.test(email) && phonePattern.test(phone) && passwordPattern.test(password);
    }
    else{
        toast('Missing Fields');
        return false;
    }
}




    const handleRegister=async(event)=>{
        event.preventDefault();
        setName(name.trim());
        setEmail(email.trim());
        setPhone(phone.trim());
        setPassword(password.trim());
        setConfirmPassword(confirmPassword.trim());
        if(isValid()){
            const result=await userRegister({name,email,phone,password,confirmPassword,role});
            if(result&&result.success){
                toast("User registered successfully");
            }
            else{
                toast("User registration failed");
            }
        }
    }

  return (
       <Container>
    <div style={{backgroundImage: 'url(https://images.stockcake.com/public/c/d/1/cd13dc35-d731-4af4-a70c-fc2f20a424cf/cricket-gear-ready-stockcake.jpg)',backgroundPosition:'center center', minHeight:'100vh', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
 
        <Row>
      <Col md={6} className="mx-auto">
    <div>
        <h1 className='text-white'>{pageTitle}</h1>  
        <Form>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label className='text-white'>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
      </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className='text-white'>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhone">
        <Form.Label className='text-white'>Phone</Form.Label>
        <Form.Control type="number" placeholder="Enter phone number" onChange={(e) => setPhone(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className='text-white'>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
        <Form.Label className='text-white'>Confirm password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
      </Form.Group>

      {isAdmin &&
      <Form.Group className='mb-3' controlId="formBasicRole">
        <Form.Label className='text-white'>Role</Form.Label>
        <Form.Select
        value={role}
        onChange={(e)=>setRole(e.target.value)}>
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
        <option value='teamManager'>Team Manager</option>
        <option value='scorer'>Scorer</option>
        </Form.Select>
        </Form.Group>}


      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" className='text-white' label="I confirm the above details" />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleRegister}>
        Submit
      </Button>
    </Form>
    </div>
    </Col>
    </Row>

    </div>
   </Container>
  )
}

export default Register

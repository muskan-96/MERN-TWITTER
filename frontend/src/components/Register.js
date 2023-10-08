import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import { useState } from 'react'
// import { Link } from 'react-router-dom'
import axios from 'axios'
import {BASE_URL }from "../config"
import Swal from 'sweetalert2'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const signup = (event) => {
        event.preventDefault();

        setLoading(true);
        const requestData = { name,username, email, password }
        console.log(requestData);
        debugger
        axios.post(`${BASE_URL}/register`, requestData)
            .then((result) => {
                debugger
                if (result.status === 201) {
                    // setLoading(false);
                    // Swal.fire({
                    //     icon: 'success',
                    //     title: 'User successy registered'
                    toast.success('Registeration successful please login to continue ', {
                      position: toast.POSITION.TOP_RIGHT
                  });
                    // })
                }
                setName('');
                setEmail('');
                setPassword('');
                setUsername('');
            })
            .catch((error) => {
                console.log(error);
              
              
                toast.error('Some error Occurred', {
                  position: toast.POSITION.TOP_RIGHT
              });
            })
    }

  return (
    <>
    <div className="outer-box ">
  
      <div className="left-box ">
        <h1>Join us</h1>
        
        
      </div>
      <div className="right-box">
       
        
        <form onSubmit={(e) => signup(e)} className="p-4">
        <h3>Register</h3>
        
            <input type="text  " value={name} onChange={(ev) => setName (ev.target.value)}   className="form-control input-narrow " placeholder=" Name" />
          
          
            <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="form-control input-narrow " placeholder="Email" />
          
          
            <input type="text " value={username} onChange={(ev) => setUsername(ev.target.value)}   className="form-control input-narrow " placeholder="Username" />
          
          
            <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)}  className="form-control input-narrow " placeholder="Password" />
          
            <button
  type="submit"
  className="mt-3 p-2"
  style={{ backgroundColor: "black", borderRadius: "10px", color: "white" }}
>
  Register
</button>

<div className=''>
  <button
    className="mt-3"
    style={{ border: "none" }}
  >
    <span className='text-muted '>Already Registered?</span>
    <Link to="/Login" className='ms-1 text-info fw-bold'>Login here</Link>
  </button>
</div>

        </form>
      
        
        </div>

    </div>
    </>
  );
};

export default Register;

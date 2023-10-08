import './Login.css'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BASE_URL }from "../config"

function Login() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
  
    const login = (event) => {
        event.preventDefault();

        setLoading(true);
        const requestData = { email, password }
        console.log(requestData);
       
        axios.post(`${BASE_URL}/login`, requestData)
            .then((result) => {
                if (result.status === 200) {
                   
                    localStorage.setItem("token", result.data.result.token);
                    localStorage.setItem('user', JSON.stringify(result.data.result.user));
                    toast.success("Logged in ", {
                      position: toast.POSITION.TOP_RIGHT});
                   //console.log(JSON.stringify(result.data.result.user));
                   console.log(localStorage.getItem("token"))
                  
                   setLoading(false);
                    navigate('/Home');
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error("Invalid credential", {
                  position: toast.POSITION.TOP_RIGHT
              });
            })
    }
    




  return (
    <>
    <div className="outer-box">
      <div className="left-box">
        <h1>Welcome Back </h1>

      </div>
      <div className="right-box">
        <h1>Login</h1>
        <form onSubmit={(e) => login(e)} >
          <div className="mt-2">
            <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)}  className="form-control" placeholder="Username" />
          </div>
          <div className="mt-4">
            <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} className="form-control" placeholder="Password" />
          </div>
          <button type="submit" className=" mt-4">Login</button>
        </form>
        <div className='mt-3 mb-5 d-grid'>
        <button className="custom-btn custom-btn-white">
                                <span className='text-muted fs-6'>Don't have an account?</span>
                                <Link to="/Register" className='ms-1 text-info fw-bold'>Sign Up</Link>
                            </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;

import './App.css';
import Login from './Login/login';
import React, { useEffect } from 'react';
import {  Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './Signup/signup';
function App() {

  const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accesstoken');
        if (!accessToken) {
            navigate('/');
        }
        else {
            navigate('/layout/dashboard')
        }
    }, []);


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;

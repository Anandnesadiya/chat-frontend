import './App.css';
import Login from './Login/login';
import Layout from './Layout/layout';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './Signup/signup';
import Dashboard from './Components/Dashboard/dashboard';
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
      <Route path="/layout" element={<Layout />} >
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;

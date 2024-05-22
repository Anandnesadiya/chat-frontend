import React from 'react'
import {  useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();


  const Logout = () => {
    localStorage.removeItem('accesstoken')
    navigate('/')
  }

  return (
    <nav className="navbar bg-black">
      <div className="container-fluid">
        <a className="navbar-brand text-light">User Name</a>
        <form className="d-flex" role="search">
          <button className="btn btn-outline-primary btn-sm mx-2 " type="submit">Profile</button>
          <button className="btn btn-outline-danger btn-sm" type="submit" onClick={Logout}>Logout</button>
        </form>
      </div>
    </nav>
  )
}

export default Header

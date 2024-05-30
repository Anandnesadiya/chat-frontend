import React, { useEffect,useState } from 'react'
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


const Header = () => {

  const navigate = useNavigate();
  const [userName,setUserName] = useState("");


  const Logout = () => {
    localStorage.removeItem('accesstoken')
    navigate('/')
    window.location.reload();
  }

  useEffect(() => {
    // getUserData();
    const accesstoken = localStorage.getItem('accesstoken');
    if (accesstoken) {
      try {
        const decodedToken = jwtDecode(accesstoken);
        setUserName(decodedToken.username);
       
      } catch (error) {
        console.log("Invalid token", error);
      }
    }
  }, []
  );


  return (
    <nav className="navbar bg-black">
      <div className="container-fluid">
        <a className="navbar-brand text-light">{userName}</a>
        <form className="d-flex" role="search">
          {/* <button className="btn btn-outline-primary btn-sm mx-2 " type="submit">Profile</button> */}
          <button className="btn btn-outline-danger btn-sm" type="submit" onClick={Logout}>Logout</button>
        </form>
      </div>
    </nav>
  )
}

export default Header

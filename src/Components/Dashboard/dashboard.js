import DashboardCss from './dashboard.module.css'
import axiosInstance from '../../config/http-common';
import React, { useEffect, useState } from 'react';


const Dashboard = () => {


    const [backendData, setBackendData] = useState([]);

    const getUserData = () => {
        axiosInstance.get("http://localhost:4000/chat/getConversationUsers")
            .then(response => {
                setBackendData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    useEffect(() => {
        getUserData();
    }, []);


    return (
        <>
            <div className="text-center border-bottom border-black border-3 row" id={DashboardCss.container}>
                <div className="col-lg-3 border-end border-black border-3" id={DashboardCss.userList} >
                    <nav className="navbar bg-body-tertiary" id={DashboardCss.childNav}>
                        <form className="d-flex" role="search">
                            <input className="form-control mx-4" id={DashboardCss.searchUser} type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success btn-sm mx-5" id={DashboardCss.searchbtn} type="submit">Search</button>
                        </form>
                    </nav>
                    <ul className="list-group">
                        {backendData.map((user, index) => (
                            <li className="list-group-item">A second item</li>
                        ))}
                    </ul>
                </div>

                <div className="col-lg-9" id={DashboardCss.chat}>
                    <nav className="navbar bg-body-tertiary" id={DashboardCss.childNav}>
                        <span className="navbar-text">
                            Navbar text with an inline element
                        </span>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Dashboard

import DashboardCss from './dashboard.module.css';
import axiosInstance from '../../config/http-common';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
// import jwt from 'jsonwebtoken';
import { useForm } from "react-hook-form";
import { jwtDecode } from 'jwt-decode';


const Dashboard = () => {
    const [userData, setuserData] = useState([]);
    const [conversationData, setconversationData] = useState([]);
    const [selectedUser, setselectedUser] = useState("");
    const [tokenData, settokenData] = useState(null);
    const [userid, setuserid] = useState("")
    const [receiverId, setreceiverID] = useState("");
    const { register, handleSubmit } = useForm();



    const getUserData = () => {
        axiosInstance.get("http://localhost:4000/chat/getConversationUsers")
            .then(response => {
                setuserData(response.data.userConversations);
                // const accessToken = localStorage.getItem('accessToken');
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    useEffect(() => {
        getUserData();
        const accesstoken = localStorage.getItem('accesstoken');
        if (accesstoken) {
            try {
                const decodedToken = jwtDecode(accesstoken);
                settokenData(decodedToken);
                setuserid(decodedToken.userid)
                console.log(decodedToken);
            } catch (error) {
                console.log("Invalid token", error);
            }
        }
    }, []
    );



    const getConversation = (ConversationID, UserName, ReceiverID) => {
        axiosInstance.get(`http://localhost:4000/chat/getMessages/${ConversationID}`)
            .then(response => {
                setconversationData(response.data.messages);
                setselectedUser(UserName);
                setreceiverID(ReceiverID);
                console.log(response.data.messages);
                console.log(UserName);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };


    function sendChatApi(message) {

        return new Promise((resolve, reject) => {
            axiosInstance.post(`http://localhost:4000/chat/sendMessage/${receiverId}`, message, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => {
                    if (res.status !== 200) {
                        reject(new Error('Failed to send chat'));
                    }
                    resolve(res.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error);
                });
        });
    }


    const onSubmit = (msg) => {
        const message = {
            message: msg.message
        };

        sendChatApi(message);
    };


    return (
        <div className="text-center border-bottom border-black border-3 row" id={DashboardCss.container}>
            <div className="col-lg-3 border-end border-black border-3" id={DashboardCss.userList} >
                <nav className="navbar bg-body-tertiary" id={DashboardCss.childNav}>
                    <form className="d-flex" role="search">
                        <input className="form-control mx-4" id={DashboardCss.searchUser} type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success btn-sm mx-5" id={DashboardCss.searchbtn} type="submit">Search</button>
                    </form>
                </nav>
                <ul className="list-group">
                    {userData.map((user, index) => (
                        <li className="list-group-item" key={index} onClick={() => getConversation(user.conversationID, user.user.UserName, user.user._id)} >
                            {user.user.UserName}
                            {/* {user.user._id} */}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="col-lg-9" id={DashboardCss.chatArea} >
                <nav className="navbar bg-body-tertiary" id={DashboardCss.childNav}>
                    {selectedUser && (
                        <span className="navbar-text">
                            {selectedUser}
                        </span>
                    )}
                </nav>
                <div id={DashboardCss.chat}>
                    {conversationData.map((chat, index) => (
                        <React.Fragment key={index}>
                            {chat.receiverID === userid ? (
                                <p className="text-start">{chat.message}</p>
                            ) : (
                                <p className="text-end">{chat.message}</p>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div id={DashboardCss.inputdiv}>
                    <div className="input-group mb-3 ">
                        <input type="text" placeholder="Something clever.." id={DashboardCss.chatInput} {...register("message")} />
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="submit" id={DashboardCss.chatSendbtn} onClick={handleSubmit(onSubmit)}>Send </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

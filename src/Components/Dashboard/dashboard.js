import DashboardCss from './dashboard.module.css';
import axiosInstance from '../../config/http-common';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
// import jwt from 'jsonwebtoken';
import { get, useForm } from "react-hook-form";
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';



const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user:detail'));
    const [userData, setuserData] = useState([]);
    const [conversationData, setconversationData] = useState([]);
    const [selectedUser, setselectedUser] = useState("");
    const [tokenData, settokenData] = useState(null);
    const [userid, setuserid] = useState("")
    const [receiverId, setreceiverID] = useState("");
    const { register, handleSubmit } = useForm();
    const [socket, setsocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [ConversationID, setConversationID] = useState("0");
    const [SelectUserName, setSelectedUserName] = useState("");
    const [ReceiverID, setReceiverID] = useState("");
    const [text, setText] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const decodedToken = jwtDecode(localStorage.getItem('accesstoken'));
    const [activeUsers, setActiveUsers] = useState([]);

    
    const chatContainerRef = useRef(null);

    useEffect(() => {
        setsocket(io('http://localhost:8080', {
            auth: {
                token: `Beare ${localStorage.getItem('accesstoken')}`
            }
        }))
    }, [])

    useEffect(() => {
        socket?.emit('addUser', userid)
        socket?.on('getUsers', users => {
            setActiveUsers(users);
            console.log("active users : ", users);
        })

        socket?.on('getMessage', data => {
            console.log(data);
            getUserData();
            getConversation(ConversationID, SelectUserName, ReceiverID)
        })
    }, [socket])

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            if (searchQuery.length > 0) {
                const response = await axiosInstance.get(`http://localhost:4000/chat/getuserbysearch/?PhoneNumber=${searchQuery}`);
                setSearchResults(response.data.userConversations);
                setuserData(response.data.userConversations);
            }
            else {
                const response = await axiosInstance.get("http://localhost:4000/chat/getConversationUsers");
                setSearchResults(response.data.userConversations);
                setuserData(response.data.userConversations);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };


    function handleOnchange(e) {
        setText(e.target.value);
    }

    useEffect(() => {
        if (socket) {
            socket.emit('addUser', userid);

            // socket.on('getUsers', users => {
            //     console.log('activeusers : >>', users);
            // });

            socket.on('getMessage', data => {
                // console.log('data : >>', data);
                // setMessages(() => ({
                //     messages: [{ user, message: data.message.message }]
                // }))

                getConversation(ConversationID, SelectUserName, ReceiverID);
            });

            return () => {
                socket.off('getUsers');
                socket.off('getMessage');
            };
        }
    }, [socket, userid, user, ConversationID, SelectUserName, ReceiverID,]);


    const getUserData = () => {
        axiosInstance.get("http://localhost:4000/chat/getConversationUsers")
            .then(response => {
                if (response) {
                    setuserData(response.data.userConversations);
                }
                else {
                    setuserData([]);
                }
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
                settokenData(decodedToken);
                setuserid(decodedToken.userid);
            } catch (error) {
                console.log("Invalid token", error);
            }
        }
    }, []
    );

    const getConversation = (ConversationID = 0) => {
        if (ConversationID != 0) {
            axiosInstance.get(`http://localhost:4000/chat/getMessages/${ConversationID}`)
                .then(response => {
                    setconversationData(response.data.messages);
                    const lastMessage = response.data.messages.slice().reverse().find((data) => data.senderID === decodedToken.userid);

                    if (lastMessage) {
                        const getUserName = userData.find((id) => id.conversationID === lastMessage.conversationID);
                        setselectedUser(getUserName.user.UserName);
                        setreceiverID(lastMessage.receiverID);
                    }
                    else {
                        // setreceiverID(userData[0]?.user._id)
                        for (let i = 0; i < userData.length; i++) {
                            if (userData[i].conversationID === response.data.messages[0].conversationID) {
                                setreceiverID(userData[i].user._id)
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
        else {
            setreceiverID(userData[0]?.user._id)
            setconversationData([]);
        }
    };


    function sendChatApi(message) {

        socket?.emit('sendMessage', {
            senderId: userid,
            receiverId: receiverId,
            message,
            conversationId: ConversationID
        })
        if (ConversationID == 0) {
            return new Promise((resolve, reject) => {
                axiosInstance.post(`http://localhost:4000/chat/sendMessage/${receiverId}`, message, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then((res) => {
                        debugger
                        getConversation(res.data.conversationID);
                        setConversationID(res.data.conversationID);
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        reject(error);
                    });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                axiosInstance.post(`http://localhost:4000/chat/sendmessage/${receiverId}`,
                    message, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((res) => {
                    getConversation(ConversationID);
                })
                    .then((res) => {
                        resolve();
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        reject(error);
                    });
            });
        }
    }

    const onSubmit = (msg) => {
        const message = {
            message: msg.message
        };

        sendChatApi(message).then(() => {
            getConversation(ConversationID);
        }).then(() => {
            if(ConversationID==0){
                getUserData();
            }
            // handleSearch();   
        })
        let clr = '';
        setText(clr);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversationData]);

    return (
        <div className="text-center border-bottom border-black border-3 row" id={DashboardCss.container}>
            <div className="col-lg-3 border-end border-black border-3" id={DashboardCss.userList} >
                <nav className="navbar bg-body-tertiary" id={DashboardCss.childNav}>
                    <form className="d-flex" role="search" onSubmit={handleSearch}>
                        <input className="form-control mx-4" id={DashboardCss.searchUser} type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <button className="btn btn-outline-success btn-sm mx-5" id={DashboardCss.searchbtn} type="submit" >Search</button>
                    </form>
                </nav>
                <ul className="list-group">
                    {(searchResults.length > 0 ? searchResults : userData).map((user, index) => {
                        const userObj = user.user || user;

                        if (!userObj.UserName) {
                            console.error('Invalid user object:', user);
                            return null;
                        }

                        const isOnline = activeUsers.some(activeUser => activeUser.userId === userObj._id);

                        return (
                            <li
                                className="list-group-item"
                                key={index}
                                onClick={() => {
                                    setConversationID(user.conversationID);
                                    setReceiverID(userObj._id);
                                    setselectedUser(userObj.UserName);
                                    getConversation(user.conversationID || "0");
                                }}
                            >
                                {userObj.UserName} {isOnline ? "online" : ""}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="col-lg-9" id={DashboardCss.chatArea}>
                <nav className="navbar bg-body-tertiary" id={DashboardCss.childNav}>
                    {selectedUser && (
                        <span className="navbar-text">
                            {selectedUser}
                        </span>
                    )}
                </nav>
                <div id={DashboardCss.chat} ref={chatContainerRef}>
                    {conversationData.map((chat, index) => (
                        <React.Fragment key={index}>
                            {chat.receiverID === userid ? (
                                <p className="text-start" id={DashboardCss.msges}>{chat.message}</p>
                            ) : (
                                <p className="text-end" id={DashboardCss.msges}>{chat.message}</p>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                {ReceiverID == "" ? (
                    <h1>Welcome</h1>
                ) : (
                    <div id={DashboardCss.inputdiv}>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                placeholder="Something clever.."
                                id={DashboardCss.chatInput}
                                {...register("message")}
                                value={text}
                                onChange={handleOnchange}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    id={DashboardCss.chatSendbtn}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
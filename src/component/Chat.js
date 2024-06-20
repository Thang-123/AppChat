import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './SideBar';
import MessageComponent from './MessageComponent';
import './Chat.css';
import {addMessage, logoutUser, setMessages, setUsers} from "../pages/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import WebSocketService from "../webSocketService";
import webSocketService from "../webSocketService";

const Chat = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const { messages, loggedIn, reLoginCode } = useSelector((state) => state.chat);
    const users = useSelector((state) => state.chat.users);
    useEffect(() => {
        // WebSocketService.connect('ws://140.238.54.136:8080/chat/chat');
        WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', (data) => {
            handleGetUserMessagesResponse(data);
        });
        WebSocketService.registerCallback('MESSAGE', (data) => {
            if (data.status === 'success') {
                dispatch(addMessage(data.mes));
            }
            console.log(data.mes)
        });
        WebSocketService.registerCallback('GET_USER_LIST', (data) => {
            handleGetUserListResponse(data);
        });
        WebSocketService.registerCallback('LOGOUT', (data) => {
            handleLogoutResponse(data);
        });

        handleGetUserList();
        return () => {
        };
    }, [dispatch]);
    function handleLogoutResponse(data) {
        if (!data) {
            console.log('Invalid response data received');
            return;
        }
        if (data.status === 'success') {
            dispatch(logoutUser());
        } else {
            const errorMessage = data.message || 'Logout failed';
            console.log(errorMessage);
        }
    }
    function handleGetUserListResponse(data){
        if (!data || data.status !== 'success') {
            console.log('Failed to fetch user list');
            return;
        }
        const users = data.data || [];
        dispatch(setUsers(users));
        console.log(users)
    }
    function handleGetUserMessagesResponse(data){
        if (!data || data.status !== 'success') {
            console.log('Failed to fetch user list');
            return;
        }
        const messages = data.data || [];
        dispatch(setMessages(messages));
        console.log(data.data)
    }
    const handleUserClick = (user) => {
        setSelectedUser(user);
        WebSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "GET_PEOPLE_CHAT_MES",
                "data": {
                    "name": user.name,
                    "page":1
                }
            }
        });
    };

    const handleSendMessage = () => {
        if (message.trim() !== '' && selectedUser) {
            const newMessage = {
                id: Date.now(),
                name: 'You',
                type: 0,
                to: selectedUser.name,
                mes: message,
                createAt: new Date().toISOString()
            };
            WebSocketService.sendMessage({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: newMessage.type,
                        to: newMessage.to,
                        mes: newMessage.mes
                    }
                }
            });
        }
    }
    const handleLogOut = () => {
        webSocketService.sendMessage({
            "action": "onchat",
            "data": {
            "event": "LOGOUT"
        }
        })
    };
    const handleJoinRoom =() =>{

    };
    const handleGetUserList =() =>{
       WebSocketService.sendMessage({
           "action": "onchat",
           "data": {
               "event": "GET_USER_LIST"
           }
       });
       }
    return (
        <div>
            <div className="chat-page d-flex">
                <div className="sidebar bg-white border-right d-flex flex-column">
                    <Sidebar onUserClick={handleUserClick}
                             onLogout = {handleLogOut}
                             onJoinRoom={handleJoinRoom}
                             onGetUserList={handleGetUserList}
                             users={users}
                    />
                </div>
                <div className="chat-content flex-grow-1 d-flex flex-column">
                    {selectedUser && (
                        <MessageComponent
                            selectedUser={selectedUser}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            message={message}
                            setMessage={setMessage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;

import React, { useEffect } from 'react';
import Sidebar from './SideBar';
import MessageComponent from './MessageComponent';
import './Chat.css';
import {logoutUser, setMessages, setUsers} from "../pages/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import WebSocketService from "../webSocketService";
import Message from '../img/message.png';
const Chat = () => {
    const dispatch = useDispatch();
    const [selectedUser, setSelectedUser] = React.useState(null);
    const { messages, loggedIn,loggedInUser, reLoginCode, users } = useSelector((state) => state.chat);
    useEffect(() => {
        WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', handleGetUserMessagesResponse);
        WebSocketService.registerCallback('GET_USER_LIST', handleGetUserListResponse);
        WebSocketService.registerCallback('LOGOUT', handleLogoutResponse);
        WebSocketService.registerCallback('SEND_CHAT', handleSendChatResponse);
        // handleGetUserList();
    }, [dispatch]);
    useEffect(() => {
        handleGetUserList();
    }, [dispatch]);
    const handleLogoutResponse = (data) => {
        if (!data) {
            console.log('Invalid response data received');
            return;
        }
        if (data.status === 'success') {
           dispatch(logoutUser());
           WebSocketService.connect('ws://140.238.54.136:8080/chat/chat')
        } else {
            const errorMessage = data.message || 'Logout failed';
            console.log(errorMessage);
        }
    };

    const handleGetUserListResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.log('Failed to fetch user list');
            return;
        }
        const users = data.data || [];
        dispatch(setUsers(users));
    };

    const handleSendChatResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.log('Failed to send chat message');
            return;
        }
        const newMessage = data.data || {};
        dispatch(setMessages([...messages, newMessage]));
        fetchLatestMessages()
    };

    const handleGetUserMessagesResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.log('Failed to fetch user messages');
            return;
        }
        // const fetchedMessages = data.data || [];
        const MessageResponse = data.data || [];
        const MessageSend = MessageResponse.map(msg =>({
            ...msg,
            sentByCurrentUser: msg.name !== loggedInUser
        }))
        dispatch(setMessages(MessageSend));
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        // console.log(selectedUser.name)
        fetchUserMessages(user);

    };

    const handleSendMessage = (newMessage) => {
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: 'people',
                    to: selectedUser.name,
                    mes: newMessage.mes
                }
            }
        });
    };

    const handleLogOut = () => {
        WebSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "LOGOUT"
            }
        });
    };

    const handleJoinRoom = () => {
    };

    const handleGetUserList = () => {
        WebSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "GET_USER_LIST"
            }
        });
    };

    const fetchUserMessages = (user) => {

        WebSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "GET_PEOPLE_CHAT_MES",
                "data": {
                    "name": user.name,
                    "page": 1
                }
            }
        });
    };
    const fetchLatestMessages = () => {
        if (selectedUser) {
            WebSocketService.sendMessage({
                action: 'onchat',
                data: {
                    event: 'GET_PEOPLE_CHAT_MES',
                    data: {
                        name: selectedUser.name,
                        page: 1
                    }
                }
            });
        }
    };

    return (
        <div className="chat-page d-flex">
            <div className="sidebar bg-white border-right d-flex flex-column" style={{flexBasis: '20%'}}>
                <Sidebar
                    onUserClick={handleUserClick}
                    onLogout={handleLogOut}
                    onJoinRoom={handleJoinRoom}
                    onGetUserList={handleGetUserList}
                    users={users}
                />
            </div>
            <div className="chat-content flex-grow-1 d-flex flex-column">
                {!selectedUser ? (
                    <img src={Message} alt="Start chatting"
                         className="center-image"/>

                ) : (
                    <MessageComponent
                        selectedUser={selectedUser}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        fetchLatestMessages={fetchLatestMessages()}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;

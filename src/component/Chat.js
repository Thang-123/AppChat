import React, { useEffect } from 'react';
import Sidebar from './SideBar';
import MessageComponent from './MessageComponent';
import './Chat.css';
import { setMessages, setUsers } from "../pages/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import WebSocketService from "../webSocketService";

const Chat = () => {
    const dispatch = useDispatch();
    const [selectedUser, setSelectedUser] = React.useState(null);
    const { messages, loggedIn, reLoginCode, users } = useSelector((state) => state.chat);

    useEffect(() => {
        WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', handleGetUserMessagesResponse);
        WebSocketService.registerCallback('GET_USER_LIST', handleGetUserListResponse);
        WebSocketService.registerCallback('LOGOUT', handleLogoutResponse);
        WebSocketService.registerCallback('SEND_CHAT', handleSendChatResponse);
        handleGetUserList();
    }, [dispatch]);

    const handleLogoutResponse = (data) => {
        if (!data) {
            console.log('Invalid response data received');
            return;
        }
        if (data.status === 'success') {
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
    };

    const handleGetUserMessagesResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.log('Failed to fetch user messages');
            return;
        }
        const messages = data.data || [];
        dispatch(setMessages(messages));
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
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
            <div className="sidebar bg-white border-right d-flex flex-column">
                <Sidebar
                    onUserClick={handleUserClick}
                    onLogout={handleLogOut}
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
                        fetchLatestMessages={fetchLatestMessages}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;

import React, {useEffect, useState} from 'react';
import Sidebar from './SideBar';
import MessageComponent from './MessageComponent';
import './Chat.css';
import {addMessage, logoutUser, setMessages, setUsers, setGroups, setMember} from "../pages/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import WebSocketService from "../webSocketService";
import Message from '../img/message.png';
import webSocketService from "../webSocketService";
import Toast from "./Toast";

const Chat = () => {
    const dispatch = useDispatch();
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [selectedGroup, setSelectedGroup] = React.useState(null);
    const [lastFetchedUser, setLastFetchedUser] = React.useState(null);
    const { messages, loggedIn, loggedInUser, reLoginCode, users, groups } = useSelector((state) => state.chat);
    const [isActive, setActiveUsers] = useState({});
    const [newMessages, setNewMessages] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastProps, setToastProps] = useState({});


    useEffect(() => {
        WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', handleGetUserMessagesResponse);
        WebSocketService.registerCallback('GET_ROOM_CHAT_MES', handleGetRoomChatResponse);
        WebSocketService.registerCallback('GET_USER_LIST', handleGetUserListResponse);
        WebSocketService.registerCallback('LOGOUT', handleLogoutResponse);
        WebSocketService.registerCallback('SEND_CHAT', handleSendChatResponse);
        WebSocketService.registerCallback('CHECK_USER', handleCheckUserActiveResponse);
        WebSocketService.registerCallback('CREATE_ROOM', handleCreateRoomResponse);
        WebSocketService.registerCallback('JOIN_ROOM', handleJoinRoomResponse);
        handleGetUserList();
    }, [dispatch]);
    const handleCreateRoomResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.error('Failed to create Room');
            handleError("Failed to create Room: "+data.mes)
            return;
        }
        handleGetUserList()
        handleSuccess("Create Room Success")
    };
    const handleJoinRoomResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.error('Failed to join Room');
            handleError(data.mes)
            return;
        }
        handleSuccess("Failed to join Room: "+data.mes)
        handleGetUserList("Join Room Success")
    };

    const handleLogoutResponse = (data) => {
        if (!data) {
            console.log('Invalid response data received');
            return;
        }
        if (data.status === 'success') {
            dispatch(logoutUser());
            WebSocketService.connect('ws://140.238.54.136:8080/chat/chat');
        } else {
            const errorMessage = data.message || 'Logout failed';
            console.log(errorMessage);
        }
    };

    const handleGetUserListResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.error('Failed to fetch user list');
            return;
        }

        const users = data.data || [];
        // Filter users with type = 1
        const groups = users.filter(user => user.type === 1);
        const peoples = users.filter(user => user.type === 0);
        if (users.length > 0) {
            dispatch(setUsers(peoples));
        }
        if (groups.length > 0) {
            dispatch(setGroups(groups));
        }
    };



    const checkUserActive = (user) =>{
            if (!user || !user.name) {
                console.error('Invalid user object passed to checkUserActive:', user);
                return;
            }
            console.log("Check active for user:" + user.name);
        webSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "CHECK_USER",
                "data": {
                    "user": user.name
                }
            }
        })
    };

    const handleCheckUserActiveResponse = (data) => {
        if (data.status !== 'success') {
            console.log('Failed to check user active');
            return;
        }
        const isActive = data.data.status;
        setActiveUsers(isActive);
    };

    const handleSendChatResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.log('Failed to send chat message');
            return;
        }
            setNewMessages("");

        const { name, mes } = data.data;

        // Cập nhật tin nhắn của user tương ứng
        setNewMessages(prevMessages => ({
            ...prevMessages,
            [name]: [
                ...(prevMessages[name] || []),
                mes
            ]
        }));
        const newMessage = {
            ...data.data,
            sentByCurrentUser: data.data.name === loggedInUser
        };

        dispatch(addMessage([...messages, newMessage]));
        fetchUserMessages(name)
        fetchGroupMessages(name)
        fetchLatestMessages()
    };


    const handleGetUserMessagesResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.log('Failed to fetch user messages');
            return;
        }
        console.log('fetching user messages ');
        const MessageResponse = data.data || [];
        const newMessages = MessageResponse.map(msg => ({
            ...msg,
            sentByCurrentUser: msg.name !== loggedInUser
        }));
        dispatch(setMessages(newMessages));

        const uniqueMembersSet = new Set();
        MessageResponse.forEach(msg => uniqueMembersSet.add(msg.name));
        const members = Array.from(uniqueMembersSet).map(name => ({name}));

        dispatch(setMember(members));
    };

    const handleGetRoomChatResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.log('Failed to fetch room messages');
            return;
        }

        console.log('fetching room messages ');
        const MessageResponse = data.data.chatData || [];
        // Sử dụng Set để lấy danh sách các thành viên duy nhất
        const uniqueMembersSet = new Set();
        MessageResponse.forEach(msg => uniqueMembersSet.add(msg.name));
        const members = Array.from(uniqueMembersSet).map(name => ({name}));

        dispatch(setMember(members));
        const newMessages = MessageResponse.map(msg => ({
            ...msg,
            sentByCurrentUser: msg.name !== loggedInUser
        }));

        dispatch(setMessages(newMessages));
    };

    function getRoomChatMes(roomName) {
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'GET_ROOM_CHAT_MES',
                data: {
                    name: roomName,
                    page: 1
                }
            }
        });
    }

    const handleUserClick = (user) => {
        if (!user || typeof user.name === 'undefined' || typeof user.type === 'undefined') {
            console.error('Invalid user object:', user);
            return;
        }

        if (selectedUser && selectedUser.name === user.name) return;
        console.log('Clicked User:', user);
        setSelectedUser(user);
        checkUserActive(user)
        console.log('Check Active :', user);
        if (user.type === 0) {
            fetchUserMessages(user.name);
        } else if (user.type === 1) {
            getRoomChatMes(user.name);
        } else {
            console.warn('Unknown user type:', user.type);
        }
    };

    const handleSendMessage = (newMessage) => {
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: selectedUser.type ? 'room' : 'people',
                    to: selectedUser.name,
                    mes: newMessage.mes
                }
            }
        });
        fetchLatestMessages()
    };

    const handleLogOut = () => {
        WebSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "LOGOUT"
            }
        });
    };

    const handleJoinRoom = (roomName) => {
        WebSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "JOIN_ROOM",
                "data": {
                    "name": roomName
                }
            }
        })
    };

    const handleGetUserList = () => {
        WebSocketService.sendMessage({
            "action": "onchat",
            "data": {
                "event": "GET_USER_LIST"
            }
        });
    };

    const fetchLatestMessages = () => {
        if (selectedUser) {
            WebSocketService.sendMessage({
                action: 'onchat',
                data: {
                    event: selectedUser.type ? 'GET_ROOM_CHAT_MES' : 'GET_PEOPLE_CHAT_MES',
                    data: {
                        name: selectedUser.name,
                        page: 1
                    }
                }
            });
        }
    };

    const fetchUserMessages = (user) => {
        console.log("fetch Message first time");
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'GET_PEOPLE_CHAT_MES',
                data: {
                    name: user,
                    page: 1
                }
            }
        });
    };

    const fetchGroupMessages = (groupName) => {

        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'GET_GROUP_CHAT_MES',
                data: {
                    name: groupName,
                    page: 1
                }
            }
        });
    };

    const handleCreateRoom = (roomName) => {
        console.log("Creating room:", roomName);
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'CREATE_ROOM',
                data: {
                    name: roomName
                }
            }
        });
    };
    const handleSuccess = (mes) => {
        setToastProps({
            title: 'SUCCEED!',
            message: mes,
            type: 'success'
        });
        setShowToast(true);
    };

    const handleError = (mes) => {
        setToastProps({
            title: 'FAILED!',
            message: mes,
            type: 'error'
        });
        setShowToast(true);
    };

    const handleCloseMessageComponent = () => {
        setSelectedUser(null);
    };
    const handleCloseToast = () => {
        setShowToast(false);
    };
    const showToastMessage = (title, message, type = 'success', duration) => {
        setToastProps({ title, message, type, duration });
        setShowToast(true);
    };

    return (

        <div className="chat-page d-flex">
            {showToast && <Toast {...toastProps} onClose={handleCloseToast} />}
            <div className="sidebar bg-white border-right d-flex flex-column" style={{ width: '400px', minWidth: '400px' }}>
                <Sidebar
                    onUserClick={handleUserClick}
                    onLogout={handleLogOut}
                    onJoinRoom={handleJoinRoom}
                    onCreateRoom={handleCreateRoom}
                    onGetUserList={handleGetUserList}
                    users={users}
                    groups={groups}
                    newMessage={newMessages || {}}
                    onSave={showToastMessage}

                />
            </div>
            <div className="chat-content flex-grow-1 d-flex flex-column">
                {!selectedUser ? (
                    <img src={Message} alt="Start chatting"
                         className="center-image"/>
                ) : (
                    <MessageComponent
                        onClose={handleCloseMessageComponent}
                        selectedUser={selectedUser}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        fetchLatestMessages={fetchLatestMessages}
                        getRoomChatMes={getRoomChatMes}
                        isActive={isActive}
                        onUserClick={handleUserClick}
                        onSave={showToastMessage}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;

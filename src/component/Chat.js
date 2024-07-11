import React, {useEffect, useState} from 'react';
import Sidebar from './SideBar';
import MessageComponent from './MessageComponent';
import './Chat.css';
import {addMessage, logoutUser, setMessages, setUsers, setGroups, setMember} from "../pages/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import WebSocketService from "../webSocketService";
import Message from '../img/message.png';
import webSocketService from "../webSocketService";

const Chat = () => {
    const dispatch = useDispatch();
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [selectedGroup, setSelectedGroup] = React.useState(null);
    const [lastFetchedUser, setLastFetchedUser] = React.useState(null);
    const { messages, loggedIn, loggedInUser, reLoginCode, users, groups } = useSelector((state) => state.chat);
    const [isActive, setActiveUsers] = useState({});
    const [newMessages, setNewMessages] = useState({});


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
            return;
        }
        handleGetUserList()

    };
    const handleJoinRoomResponse = (data) => {
        if (!data || data.status !== 'success') {
            console.error('Failed to join Room');
            return;
        }
        handleGetUserList()
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
            dispatch(setGroups(groups)); // Assuming setGroups updates group state
        }
    };


    // const handleGetGroupListResponse = (data) => {
    //     if (!data || data.status !== 'success') {
    //         console.error('Failed to fetch group list');
    //         return;
    //     }
    //
    //     const groups = data.data.type === 1 || [];
    //
    //     dispatch(setGroups(groups)); // Assuming setGroups updates group state
    // };


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
        const members = Array.from(uniqueMembersSet);

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
        // if(newMessages !== null){
        //     setNewMessages(null);
        // }

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

    // const handleGroupClick = (group) => {
    //     if (!group || typeof group.id === 'undefined' || typeof group.name === 'undefined') {
    //         console.error('Invalid group object:', group);
    //         return;
    //     }
    //
    //     if (selectedGroup && selectedGroup.id === group.id) return;
    //     console.log('Clicked Group:', group);
    //     setSelectedGroup(group);
    //     console.log('Check Active:', group);
    //
    //     if (group.type === 0) { // Public Group
    //         fetchGroupMessages(group.id); // Assuming fetchGroupMessages exists
    //     } else if (group.type === 1) { // Private Group
    //         getRoomChatMes();
    //     } else {
    //         console.warn('Unknown group type:', group.type);
    //     }
    // };

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

//     // Create a custom event (without using a constructor)
//     const createRoomLogEvent = new Event('createRoomLog');
//
// // Wrap handleCreateRoom with event emission
//     const handleCreateRoom = (roomName) => {
//         console.log("Creating room:", roomName);
//         WebSocketService.sendMessage({
//             action: 'onchat',
//             data: {
//                 event: 'CREATE_ROOM',
//                 data: {
//                     name: roomName
//                 }
//             }
//         });
//
//         // Emit the event with the console.log message
//         dispatchEvent(createRoomLogEvent({ message: console.log.toString() })); // Assuming console.log returns a string
//     };
//
// // Function to display captured messages
//     function displayCapturedLog(message) {
//         const logContainer = document.getElementById('log-container'); // Assuming an element with ID 'log-container'
//         if (logContainer) { // Check if the element exists
//             logContainer.innerHTML += `<p>${message}</p>`;
//         } else {
//             console.error('Log container element (ID: log-container) not found!');
//         }
//     }
//
// // Event listener for displaying messages
//     window.addEventListener('createRoomLog', (event) => {
//         displayCapturedLog(event.detail.message);
//     });

    function showSuccessToast() {
        toast({
            title: "Thành công!",
            message: "Đã cập nhật các thay đổi",
            type: "success",
            duration: 5000
        });
    }

    function showErrorToast() {
        toast({
            title: "Thất bại!",
            message: "Có lỗi xảy ra, vui lòng kiểm tra lại",
            type: "error",
            duration: 5000
        });
    }

    function toast({ title = "", message = "", type = "info", duration = 3000 }) {
        const main = document.getElementById("toast");
        if (main) {
            const toast = document.createElement("div");

            // Auto remove toast
            const autoRemoveId = setTimeout(function () {
                main.removeChild(toast);
            }, duration + 1000);

            // Remove toast when clicked
            toast.onclick = function (e) {
                if (e.target.closest(".toast__close")) {
                    main.removeChild(toast);
                    clearTimeout(autoRemoveId);
                }
            };

            const icons = {
                success: "fas fa-check-circle",
                error: "fas fa-exclamation-circle"
            };
            const icon = icons[type];
            const delay = (duration / 1000).toFixed(2);

            toast.classList.add("toast", `toast--${type}`);
            toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

            toast.innerHTML = `
                    <div class="toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="toast__body">
                        <h3 class="toast__title">${title}</h3>
                        <p class="toast__msg">${message}</p>
                    </div>
                    <div class="toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
            main.appendChild(toast);
        }
    }

    const handleCloseMessageComponent = () => {
        setSelectedUser(null);
    };
    return (
        <div className="chat-page d-flex">
            <div className="sidebar bg-white border-right d-flex flex-column" style={{ flexBasis: '25%' }}>
                <Sidebar
                    onUserClick={handleUserClick}
                    onGroupClick={handleUserClick}
                    onLogout={handleLogOut}
                    onJoinRoom={handleJoinRoom}
                    onCreateRoom={handleCreateRoom}
                    onGetUserList={handleGetUserList}
                    returnSuccess={showSuccessToast}
                    returnError={showErrorToast}
                    users={users}
                    groups={groups}
                    newMessage={newMessages || {}}

                />
            </div>
            <div className="chat-content flex-grow-1 d-flex flex-column">
                {!selectedUser ? (
                    <img src={Message} alt="Start chatting"
                         className="center-image" />
                ) : (
                    <MessageComponent
                        onClose={handleCloseMessageComponent}
                        selectedUser={selectedUser}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        fetchLatestMessages={fetchLatestMessages}
                        getRoomChatMes = {getRoomChatMes}
                        isActive={isActive}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;

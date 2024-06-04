
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './SideBar';
import MessagePage from './MessagePage';
import './Chat.css';
import {addMessage} from "../pages/chatSlice";
import {useDispatch, useSelector} from "react-redux";
import Header from "./Header";

const Chat = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const websocket = useRef(null);
    const {messages, loggedIn, reLoginCode } = useSelector((state) => state.chat);

    const [groups, setGroups] = useState([
        { name: 'Picnic', message: 'I want to ask about the group chat ...', unread: 1, icon: 'icon1.png' },
        { name: 'Health', message: 'I want to ask about the group chat ...', unread: 3, icon: 'icon2.png' },
        { name: 'Treat Yourself', message: 'I want to ask about the group chat ...', unread: 2, icon: 'icon3.png' },
        { name: 'Atabey Tours', message: 'I want to ask about the group chat ...', unread: 0, icon: 'icon4.png' },
        { name: 'Book Club', message: 'I want to ask about the group chat ...', unread: 0, icon: 'icon5.png' },
        { name: 'Farm ', message: 'I want to ask about the group chat ...', unread: 0, icon: 'icon6.png' },
        { name: 'San Juan', message: 'I want to ask about the group chat ...', unread: 0, icon: 'icon7.png' },
        { name: 'Puerto Rico', message: 'I want to ask about the group chat ...', unread: 0, icon: 'icon8.png' },
    ]);
    useEffect(() => {
        websocket.current = new WebSocket('ws://140.238.54.136:8080/chat/chat');

        websocket.current.onopen = () => {
            console.log('WebSocket disconnected');
            handleGetReloginFromStorage()
        };

        websocket.current.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            console.log('Received:', parsedData);
            handleServerResponse(parsedData); // Xử lý phản hồi từ server
            if (parsedData.event === 'MESSAGE') {
                dispatch(addMessage({ message: parsedData.message }));
            }
        };

        websocket.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            websocket.current.close();
        };
    }, [dispatch]);

    const handleGetReloginFromStorage = () => {
        console.log('WebSocket connected');
        // Kiểm tra xem có thông tin đăng nhập đã được lưu không
        const storedUserName = localStorage.getItem('user');
        const storedLoginCode = localStorage.getItem('code');
        if (storedUserName && storedLoginCode) {
            const username = JSON.parse(storedUserName).username;
            const reLoginCode = JSON.parse(storedLoginCode).reLoginCode;
            handleRelogin(username, reLoginCode);
        }
        else{
            console.log("KO co data trong local storage")
        }
    };

    const handleRelogin = (user, code) => {
        if (websocket.current.readyState === WebSocket.OPEN) {
            websocket.current.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'RE_LOGIN',
                    data: {
                        user: user,
                        code: code,
                    }
                }
            }));
        } else {
            console.log('WebSocket is not open yet.');
        }
    }
    const handleJoinRoom =(data) => {
        if (websocket.current.readyState === WebSocket.OPEN) {
            if(loggedIn){
                websocket.current.send(JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'JOIN_ROOM',
                        data: {
                            name: 'ABC'
                        }
                    }

            }))
            }
        }
    }
    const getRoomChatMess =(data) => {
        if (websocket.current.readyState === WebSocket.OPEN) {
            if(loggedIn){
                websocket.current.send(JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'GET_ROOM_CHAT_MES',
                        data: {
                            name: 'ABC',
                            page: 1
                        }
                    }

                }))
            }
        }
    }
    const handleServerResponse = (data) => {
        switch (data.event) {
            case 'RE_LOGIN':
                if (data.status === 'success') {
                    console.log("relogin success");
                }
                break;
            case 'SEND_CHAT':
                if (data.status === 'success') {
                    console.log(data.mes);
                }else{
                    console.log(data.mes);
                }
                break;
            case 'JOIN_ROOM':
                if (data.status === 'success') {
                    console.log(data.mes);
                }
                break;
            default:
                console.log('Unknown event:', data.event);
        }
    };
    const handleSendMessage = () => {
        if (websocket.current.readyState === WebSocket.OPEN) {
            websocket.current.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'room',
                        to: 'ABC',
                        mes: message
                    }
                }
            }));
        } else {
            console.log('WebSocket is still connecting or closed.');
        }
    };

    let handleCreateRoom;
    return (
        <div>
            <Header onJoinRoom={handleJoinRoom} onCreateRoom={handleCreateRoom} />
            <div className="chat-page d-flex">
                <div className="sidebar bg-white border-right d-flex flex-column">
                    <Sidebar groups={groups}/>
                </div>
                <div className="chat-content flex-grow-1 d-flex flex-column">
                    <MessagePage messages={messages} onSendMessage={handleSendMessage}/>
                </div>
            </div>

        </div>

    );
};
export default Chat
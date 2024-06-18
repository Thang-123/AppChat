
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './SideBar';
import MessagePage from './MessagePage';
import './Chat.css';
import {addMessage} from "../pages/chatSlice";
import {useDispatch, useSelector} from "react-redux";
import WebSocketService from "../webSocketService";

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
        WebSocketService.connect('ws://140.238.54.136:8080/chat/chat')
        return () => {
            WebSocketService.close();
        };
    }, [dispatch]);


    const handleJoinRoom =(data) => {

    }
    const getRoomChatMess =(data) => {

    }
    const handleSendMessage = () => {

    };

    let handleCreateRoom;
    return (
        <div>
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
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {addMessage, loginUser, logoutUser, registerUser} from './chatSlice';
import axios from 'axios';

const Sidebar = ({ messages }) => (
    <div className="overflow-auto" style={{ maxHeight: '400px' }}>
        {messages && messages.map((msg, index) => (
            <div key={index} className="mb-2">
                {msg.startsWith('http') ? (
                    <img src={msg} alt="Uploaded" className="max-w-full" />
                ) : (
                    <div className="bg-blue-500 text-white px-4 py-2 rounded">{msg}</div>
                )}
            </div>
        ))}
    </div>
);

const MessagePage = ({handleJoinRoom, handleSendMessage, handleUploadImage, logout }) => {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);

    return (
        <div>
            <div className="input-group mt-3">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control"
                    placeholder="Type a message"
                />
                <button
                    onClick={handleSendMessage}
                    className="btn btn-primary"
                >
                    Send
                </button>
            </div>
            <div className="mt-3">
                <div className="input-group">
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} className="form-control" />
                    <button
                        onClick={handleUploadImage}
                        className="btn btn-success"
                    >
                        Upload Image
                    </button>
                </div>
            </div>
            <div className="card-footer text-center">
                <button
                    onClick={logout}
                    className="btn btn-danger"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

const ChatPage = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const websocket = useRef(null);
    const {messages, loggedIn, reLoginCode } = useSelector((state) => state.chat);

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
    // const handleJoinRoom =(data) => {
    //     if (websocket.current.readyState === WebSocket.OPEN) {
    //         if(loggedIn){
    //             websocket.current.send(JSON.stringify({
    //                 action: 'onchat',
    //                 data: {
    //                     event: 'JOIN_ROOM',
    //                     data: {
    //                         name: 'ABC'
    //                     }
    //                 }
    //
    //         }))
    //         }
    //     }
    // }
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

    const handleUploadImage = async () => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('http://140.238.54.136:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const imageUrl = response.data.imageUrl;
            websocket.current.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'room',
                        to: 'abc',
                        mes: imageUrl,
                    },
                },
            }));
            setImage(null); // Reset the file input
        } catch (error) {
            console.error('Error uploading image', error);
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Chat Room</h2>
            <div className="row mt-4">
                <div className="col-md-3">
                    <Sidebar messages={messages} />
                </div>
                <div className="col-md-9">
                    <MessagePage
                        handleSendMessage={handleSendMessage}
                        handleUploadImage={handleUploadImage}
                        logout={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

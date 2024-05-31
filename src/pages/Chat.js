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

const MessagePage = ({ handleSendMessage, handleUploadImage, logout }) => {
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
        // Kiểm tra xem có thông tin đăng nhập được lưu không
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const { username, reLoginCode } = JSON.parse(storedUserInfo);
            handleRelogin(username, reLoginCode);
        }

        websocket.current = new WebSocket('ws://140.238.54.136:8080/chat/chat');

        websocket.current.onopen = () => {
            console.log('WebSocket connected');
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
            handleWebSocketClose();
        };

        return () => {
            websocket.current.close();
        };
    }, [dispatch]);

    const handleWebSocketClose = () => {
        console.log('WebSocket disconnected');
        // Kiểm tra xem có thông tin đăng nhập đã được lưu không
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const { username, reLoginCode } = JSON.parse(storedUserInfo);
            handleRelogin(username, reLoginCode);
        }
    };

    const handleRelogin = (username, reloginCode) => {
        // Thực hiện tái đăng nhập
        if (websocket.current === WebSocket.OPEN) {
            websocket.current.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'RE_LOGIN',
                    data: {
                        user: username,
                        code: reloginCode
                    }
                }
            }));
        } else {
            console.log('WebSocket is still connecting or closed.');
        }
    };
    const handleServerResponse = (data) => {
        switch (data.event) {
            case 'LOGIN':
                if (data.status === 'success') {
                    if (loggedIn && reLoginCode) {
                        handleRelogin(reLoginCode)
                            .then((user) => {
                                dispatch(loginUser({ user, reLoginCode: null })); // Clear reLoginCode after successful re-login
                                // Reconnect WebSocket or handle reconnection logic
                            })
                            .catch((error) => {
                                console.error('Error during re-login:', error);
                                // Handle re-login error
                            });
                    }
                } else {
                    // alert(data.mes);
                }
                break;
            default:
                console.log('Unknown event:', data.event);
        }
    };
        const handleSendMessage = () => {
        if (websocket.current === WebSocket.OPEN) {
            websocket.current.send(JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'room',
                        to: 'abc',
                        mes: message
                    }
                }
            }));
            setMessage('');
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

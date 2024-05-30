import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser, logoutUser, addMessage, setMessages } from './chatSlice';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Home = () => {
    const dispatch = useDispatch();
    const { user, messages, loggedIn, reLoginCode } = useSelector((state) => state.chat);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [socket, setSocket] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const newSocket = io('http://140.238.54.136:8080');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('WebSocket connected');
            if (reLoginCode) {
                newSocket.emit('onchat', {
                    action: 'onchat',
                    data: {
                        event: 'RE_LOGIN',
                        data: {
                            user: user,
                            code: reLoginCode
                        }
                    }
                });
            }
        });

        newSocket.on('message', (data) => {
            const parsedData = JSON.parse(data);
            console.log('Received:', parsedData);
            if (parsedData.event === 'MESSAGE') {
                dispatch(addMessage({ message: parsedData.message }));
            }
        });

        newSocket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        return () => {
            newSocket.close();
        };
    }, [dispatch, reLoginCode, user]);

    const handleRegister = () => {
        navigate('/register'); // Navigate to RegisterPage
    };

    const handleLogin = () => {
        socket.emit('onchat', {
            action: 'onchat',
            data: {
                event: 'LOGIN',
                data: {
                    user: username,
                    pass: password
                }
            }
        });
        socket.on('login', (data) => {
            if (data.status === 'success') {
                dispatch(loginUser({ user: username, reLoginCode: data.data.RE_LOGIN_CODE }));
            }
        });
    };

    const handleSendMessage = () => {
        socket.emit('onchat', {
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: 'room',
                    to: 'abc',
                    mes: message
                }
            }
        });
        setMessage('');
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
            socket.emit('onchat', {
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'room',
                        to: 'abc',
                        mes: imageUrl,
                    },
                },
            });
        } catch (error) {
            console.error('Error uploading image', error);
        }
    };

    return (
        <div>
            {!loggedIn ? (
                <div>
                    <h1>Register/Login</h1>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleRegister}>Register</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div>
                    <h1>Chat</h1>
                    <div>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                {msg.startsWith('http') ? (
                                    <img src={msg} alt="Uploaded" style={{ maxWidth: '100%' }} />
                                ) : (
                                    msg
                                )}
                            </div>
                        ))}
                    </div>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={handleSendMessage}>Send</button>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    <button onClick={handleUploadImage}>Upload Image</button>
                    <button onClick={() => dispatch(logoutUser())}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default Home;

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser, logoutUser, addMessage } from './chatSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const { user, messages, loggedIn, reLoginCode } = useSelector((state) => state.chat);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [loginSuccess, setLoginSuccess] = useState('');
    const websocket = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        websocket.current = new WebSocket('ws://140.238.54.136:8080/chat/chat');

        websocket.current.onopen = () => {
            console.log('WebSocket connected');
            if (reLoginCode) {
                websocket.current.send(JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'RE_LOGIN',
                        data: {
                            user: user,
                            code: reLoginCode
                        }
                    }
                }));
            }
        };

        websocket.current.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            console.log('Received:', parsedData);
            handleServerResponse(parsedData);
        };

        websocket.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            websocket.current.close();
        };
    }, [dispatch, reLoginCode, user]);

    const handleServerResponse = (data) => {
        switch (data.event) {
            case 'REGISTER':
                if (data.status === 'success') {
                    dispatch(registerUser({ user: username }));
                }
                break;
            case 'LOGIN':
                if (data.status === 'success') {
                    dispatch(loginUser({ user: username, reLoginCode: data.data.RE_LOGIN_CODE }));
                    console.log('Login successful!');
                }
                break;
            case 'MESSAGE':
                dispatch(addMessage({ message: data.message }));
                break;

            default:
                console.log('event:', data.event);
        }
    };

    const handleRegister = () => {
        websocket.current.send(JSON.stringify({
            action: 'onchat',
            data: {
                event: 'REGISTER',
                data: {
                    user: username,
                    pass: password
                }
            }
        }));
    };

    const handleLogin = () => {
        websocket.current.send(JSON.stringify({
            action: 'onchat',
            data: {
                event: 'LOGIN',
                data: {
                    user: username,
                    pass: password
                }
            }
            }));
    };

        const handleSendMessage = () => {
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

        return (
            <div>
                {!loggedIn ? (
                    <div>
                        <h1>Register/Login</h1>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={handleRegister}>Register</button>
                        <button onClick={handleLogin}>Login</button>
                        {loginSuccess && <p>{loginSuccess}</p>}
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

import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "./chatSlice";

const LoginPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const websocket = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        websocket.current = new WebSocket('ws://140.238.54.136:8080/chat/chat');

        websocket.current.onopen = () => {
            console.log('WebSocket connected');
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
    }, [dispatch]);

    const handleServerResponse = (data) => {
        switch (data.event) {
            case 'REGISTER':
                if (data.status === 'success') {
                    dispatch(registerUser({ user: username }));
                    navigate('login');
                } else {
                    setFeedbackMessage(data.mes);
                }
                break;
            case 'LOGIN':
                if (data.status === 'success') {
                    // Lưu thông tin đăng nhập vào localStorage
                    localStorage.setItem('userInfo', JSON.stringify({ username: username, reLoginCode: data.data.RE_LOGIN_CODE }));
                    // Dispatch action để lưu thông tin đăng nhập vào Redux store
                    dispatch(loginUser({ user: username, reLoginCode: data.data.RE_LOGIN_CODE }));
                    navigate('/');
                } else {
                    setFeedbackMessage(data.mes);
                }
                break;
            default:
                console.log('Unknown event:', data.event);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Chat Application</h2>
                            <p className="card-text text-center">Sign in to your account</p>

                            <form onSubmit={(e) => e.preventDefault()} className="mt-4">
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="button" onClick={handleLogin} className="btn btn-primary w-100">Login</button>
                            </form>

                            {feedbackMessage && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {feedbackMessage}
                                </div>
                            )}

                        </div>
                    </div>
                    <p className="mt-3 text-center">Don't have an account? <Link to="/register" className="text-primary">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

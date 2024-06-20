import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "./chatSlice";
import WebSocketService from "../webSocketService";

const LoginPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleLogin = () => {
        localStorage.clear()
        console.log('Attempting to login with username:', JSON.stringify({ username }));
        localStorage.setItem('user', JSON.stringify({ username }));
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'LOGIN',
                data: {
                    user: username,
                    pass: password
                }
            }
        });

    };

    useEffect(() => {
        // WebSocketService.connect('ws://140.238.54.136:8080/chat/chat');
        WebSocketService.registerCallback('LOGIN',(data) => {
            console.log('Login response:', data);
            handleServerResponse(data);
        });
        return () => {
        };
    }, [dispatch]);
    const handleServerResponse = (data) => {
            if (!data) {
                console.error('Invalid response data received');
                setFeedbackMessage('Unexpected response from server');
                return;
            }

            if (data.status === 'success' ) {
                const reLoginCode = data.data.RE_LOGIN_CODE;
                if (reLoginCode) {
                    dispatch(loginUser({ user: username, reLoginCode }));
                    localStorage.setItem('code', JSON.stringify({reLoginCode }));
                    console.log(localStorage.getItem('user'));
                    console.log(localStorage.getItem('code'));
                } else {
                    console.error('RE_LOGIN_CODE is missing in the response data.');
                }
            } else {
                const errorMessage = data.message || ' Login failed';
                setFeedbackMessage(errorMessage);
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

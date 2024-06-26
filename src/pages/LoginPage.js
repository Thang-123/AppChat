import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginUser, registerUser, setLoggedInUser, setLoggedInUSer} from "./chatSlice";
import WebSocketService from "../webSocketService";
import '../component/Chat.css';

const LoginPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const user = useSelector(state => state.chat)
    const handleLogin = () => {
        localStorage.clear()
        console.log('Attempting to login with username:', JSON.stringify({ username }));
        dispatch(setLoggedInUser(username));
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
        <div className="container">
            <div className="card-body">
                <div className="sign-in">
                    <h2 className="title-text">Sign In</h2>
                    <p className="text-text">Sign in to your account</p>
                </div>

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

                    <button type="button" onClick={handleLogin} className="btn btn-primary w-100">Login
                    </button>
                </form>

                {feedbackMessage && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {feedbackMessage}
                    </div>
                )}

                <p className="mt-3 text-center">Don't have an account? <Link to="/register" className="text-primary">Sign Up</Link></p>
            </div>
        </div>
    );
};
export default LoginPage;

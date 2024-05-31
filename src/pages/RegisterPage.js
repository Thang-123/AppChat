import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser, loginUser } from './chatSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const websocket = useRef(null);
    const navigate = useNavigate();

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
                    // alert(data.mes);
                    setFeedbackMessage(data.mes);
                }
                break;
            case 'LOGIN':
                if (data.status === 'success') {
                    dispatch(loginUser({ user: username, reLoginCode: data.data.RE_LOGIN_CODE }));
                    navigate('/');
                } else {
                    setFeedbackMessage(data.mes); // Lấy thông báo từ phản hồi và hiển thị
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

                                <button type="button" onClick={handleRegister} className="btn btn-primary w-100">Register</button>
                            </form>

                            {feedbackMessage && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {feedbackMessage}
                                </div>
                            )}

                        </div>
                    </div>
                    <p className="mt-3 text-center">Already have an account? <Link to="/login" className="text-primary">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

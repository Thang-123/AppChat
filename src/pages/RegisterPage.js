import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from './chatSlice';
import { useNavigate, Link } from 'react-router-dom';
import WebSocketService from '../webSocketService';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        WebSocketService.registerCallback('REGISTER', (data) =>{
            console.log('Register Response:' +data)
            handleServerResponse(data)
        });

        return () => {
            // WebSocketService.close();
        };
    }, []);

    const handleServerResponse = (data) => {
        if (!data) {
            console.error('Invalid response data received');
            setFeedbackMessage('Unexpected response from server');
            return;
        }

        if (data.status === 'success') {
            dispatch(registerUser({ user: username }));
            navigate('/login');
        } else {
            const errorMessage = data.message || 'Registration failed';
            setFeedbackMessage(errorMessage);
        }
    };


    const handleRegister = () => {
        WebSocketService.sendMessage({
            action: 'onchat',
            data: {
                event: 'REGISTER',
                data: {
                    user: username,
                    pass: password
                }
            }
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Chat Application</h2>
                            <p className="card-text text-center">Create your account</p>

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
